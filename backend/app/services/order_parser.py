import re
import json
import logging
from typing import List, Dict, Any, Tuple
import httpx
from ..config import settings

logger = logging.getLogger("dukaan_saathi.order_parser")

# Hindi word to numeric value mapping
HINDI_NUMBER_WORDS = {
    "aadha": 0.5,
    "adha": 0.5,
    "half": 0.5,
    "pao": 0.25,
    "ek": 1.0,
    "one": 1.0,
    "do": 2.0,
    "two": 2.0,
    "teen": 3.0,
    "tin": 3.0,
    "three": 3.0,
    "chaar": 4.0,
    "char": 4.0,
    "four": 4.0,
    "paanch": 5.0,
    "panch": 5.0,
    "five": 5.0,
    "chhah": 6.0,
    "chhe": 6.0,
    "che": 6.0,
    "six": 6.0,
    "saat": 7.0,
    "seven": 7.0,
    "aath": 8.0,
    "ath": 8.0,
    "eight": 8.0,
    "nau": 9.0,
    "nine": 9.0,
    "das": 10.0,
    "dus": 10.0,
    "ten": 10.0,
    "dedh": 1.5,
    "dhai": 2.5,
    "dhayi": 2.5
}

# Unit normalization dictionary
UNIT_MAP = {
    "kg": "kg",
    "kilo": "kg",
    "kilos": "kg",
    "kilogram": "kg",
    "kilograms": "kg",
    "litre": "litre",
    "liter": "litre",
    "litres": "litre",
    "liters": "litre",
    "l": "litre",
    "ltr": "litre",
    "packet": "packet",
    "packets": "packet",
    "pack": "packet",
    "packs": "packet",
    "pkt": "packet",
    "bottle": "bottle",
    "bottles": "bottle",
    "tube": "tube",
    "tubes": "tube",
    "gram": "gram",
    "grams": "gram",
    "gm": "gram",
    "g": "gram"
}

# Stopwords and conversational filler words in Hindi/Hinglish
FILLER_WORDS = [
    r"\bbhaiya\b", r"\bbhai\b", r"\bji\b", r"\bchahiye\b", r"\bdena\b", r"\bdedo\b",
    r"\blao\b", r"\bpack\s+kar\s+do\b", r"\bkar\s+do\b", r"\bkripya\b", r"\bplease\b",
    r"\bek\s+dum\b", r"\bturrant\b", r"\bdost\b", r"\bdukaan\s+wale\b", r"\bhume\b",
    r"\bmujhe\b", r"\bhame\b", r"\bdo\s+na\b", r"\bhoga\b"
]


class OrderParserService:
    def __init__(self):
        self.evon_key = settings.EVON_API_KEY
        self.evon_endpoint = settings.EVON_ENDPOINT

    def clean_text(self, text: str) -> str:
        """Removes conversational filler words and cleans whitespace."""
        cleaned = text.lower().strip()
        for filler in FILLER_WORDS:
            cleaned = re.sub(filler, " ", cleaned, flags=re.IGNORECASE)
        # normalize spaces
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    def parse_with_rules(self, text: str) -> List[Dict[str, Any]]:
        """
        Deterministic, robust rule-based parser for Hindi/Hinglish grocery orders.
        Extracts [{'raw_item': str, 'quantity': float, 'unit': str}].
        """
        cleaned = self.clean_text(text)
        logger.info(f"Rule-based parsing cleaned input: '{cleaned}' from original: '{text}'")

        # Split multiple items connected by 'aur', 'and', ',', 'tatha', 'saath me', 'bhi'
        clause_splitters = r"\s+(?:aur|and|tatha|saath\s+me|bhi)\s+|,\s*|\.\s*"
        clauses = [c.strip() for c in re.split(clause_splitters, cleaned) if c.strip()]

        parsed_items: List[Dict[str, Any]] = []

        for clause in clauses:
            item_info = self._extract_clause_item(clause)
            if item_info:
                parsed_items.append(item_info)

        return parsed_items

    def _extract_clause_item(self, clause: str) -> Optional[Dict[str, Any]]:
        """Extracts quantity, unit, and item name from an individual clause."""
        words = clause.split()
        if not words:
            return None

        quantity: float = 1.0
        unit: str = ""
        found_qty = False
        remaining_words: List[str] = []

        i = 0
        while i < len(words):
            w = words[i].lower()

            # Case A: Check numeric digit or float (e.g. "2", "2.5", "1/2")
            if re.match(r"^\d+(\.\d+)?$", w):
                quantity = float(w)
                found_qty = True
                i += 1
                continue

            # Case B: Check Hindi written number words (e.g. "do", "ek", "aadha", "paanch")
            if w in HINDI_NUMBER_WORDS:
                quantity = HINDI_NUMBER_WORDS[w]
                found_qty = True
                i += 1
                continue

            # Case C: Check combined number+unit e.g. "2kg", "1litre", "500g"
            combined_match = re.match(r"^(\d+(\.\d+)?)\s*(kg|kilo|litre|liter|l|ltr|pkt|pack|packet|gm|g|gram)$", w)
            if combined_match:
                quantity = float(combined_match.group(1))
                unit_key = combined_match.group(3)
                unit = UNIT_MAP.get(unit_key, unit_key)
                found_qty = True
                i += 1
                continue

            # Case D: Check unit word
            if w in UNIT_MAP:
                unit = UNIT_MAP[w]
                i += 1
                continue

            # Regular word belonging to item description
            remaining_words.append(words[i])
            i += 1

        raw_item = " ".join(remaining_words).strip()

        # Handle gram unit conversion to kg if needed (e.g. 500 gram -> 0.5 kg)
        if unit == "gram":
            quantity = quantity / 1000.0
            unit = "kg"

        if raw_item:
            return {
                "raw_item": raw_item,
                "quantity": quantity,
                "unit": unit
            }
        return None

    async def parse_with_evon_llm(self, text: str) -> Tuple[Optional[List[Dict[str, Any]]], str]:
        """
        Calls Gnani Evon LLM / OpenAI-compatible endpoint with strict JSON schema.
        Returns (parsed_items, "evon_llm") or (None, reason).
        """
        if not self.evon_key or not settings.has_evon_key:
            return None, "No EVON_API_KEY provided"

        prompt = (
            "You are Dukaan Saathi's Hindi/Hinglish order parser. "
            "Extract items, numerical quantities, and standard units (kg, litre, packet, bottle, tube) "
            "from the customer's text. Return ONLY a strict JSON object with an 'items' array.\n"
            "Format: {\"items\": [{\"raw_item\": \"chawal\", \"quantity\": 2.0, \"unit\": \"kg\"}]}\n\n"
            f"Customer text: \"{text}\""
        )

        headers = {
            "Authorization": f"Bearer {self.evon_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "messages": [
                {"role": "system", "content": "You are a precise JSON grocery order extractor for Indian kirana stores. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1
        }

        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.post(self.evon_endpoint, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    # Extract JSON block
                    json_str = re.search(r"\{.*\}", content, re.DOTALL)
                    if json_str:
                        parsed = json.loads(json_str.group())
                        return parsed.get("items", []), "evon_llm"
        except Exception as e:
            logger.warning(f"Evon LLM API call failed or timed out: {e}. Falling back to rule parser.")

        return None, "Evon LLM failed"

    async def parse_order(self, text: str) -> Tuple[List[Dict[str, Any]], str]:
        """
        Orchestrates order parsing: tries Evon LLM first if configured;
        falls back smoothly to rule-based parser.
        """
        # Try Evon LLM if enabled
        if settings.has_evon_key and not settings.MOCK_GNANI_APIS:
            llm_result, method = await self.parse_with_evon_llm(text)
            if llm_result:
                return llm_result, "evon_llm"

        # Fallback to deterministic rules
        rule_result = self.parse_with_rules(text)
        return rule_result, "fallback_rules"

