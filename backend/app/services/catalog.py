from typing import List, Optional, Tuple, Dict
from sqlalchemy.orm import Session
from difflib import SequenceMatcher
from ..models import Product
from ..schemas import ParsedOrderItem


# Seed catalog data for fallback or initial seeding
SEED_PRODUCTS = [
    {
        "name": "Chawal",
        "hindi_name": "चावल",
        "aliases": "chawal, rice, chaval, chawal, chaawal, chawal",
        "unit": "kg",
        "price": 60.0,
        "stock": 50.0
    },
    {
        "name": "Atta",
        "hindi_name": "आटा",
        "aliases": "atta, gehu ka atta, flour, aatta, gehun atta",
        "unit": "kg",
        "price": 45.0,
        "stock": 40.0
    },
    {
        "name": "Toor Dal",
        "hindi_name": "तूर दाल",
        "aliases": "toor dal, arhar dal, dal, arhar, toor, tur dal",
        "unit": "kg",
        "price": 140.0,
        "stock": 25.0
    },
    {
        "name": "Refined Oil",
        "hindi_name": "रिफाइंड तेल",
        "aliases": "refined oil, tel, oil, refined, cooking oil, mustard oil, sarso tel",
        "unit": "litre",
        "price": 180.0,
        "stock": 20.0
    },
    {
        "name": "Sugar",
        "hindi_name": "चीनी",
        "aliases": "sugar, cheeni, chini, shakkar, sakhar",
        "unit": "kg",
        "price": 48.0,
        "stock": 35.0
    },
    {
        "name": "Salt",
        "hindi_name": "नमक",
        "aliases": "salt, namak, white salt, tata salt",
        "unit": "kg",
        "price": 25.0,
        "stock": 40.0
    },
    {
        "name": "Biscuit",
        "hindi_name": "बिस्कुट",
        "aliases": "biscuit, biscuits, parle-g, parle g, cookies, biscuit packet",
        "unit": "packet",
        "price": 20.0,
        "stock": 60.0
    },
    {
        "name": "Detergent",
        "hindi_name": "डिटर्जेंट",
        "aliases": "detergent, surf, washing powder, detergent powder, tide, ariel, ghadi surf",
        "unit": "kg",
        "price": 120.0,
        "stock": 15.0
    },
    {
        "name": "Shampoo",
        "hindi_name": "शैम्पू",
        "aliases": "shampoo, clinic plus, head and shoulders, hair wash, shampo",
        "unit": "bottle",
        "price": 99.0,
        "stock": 18.0
    },
    {
        "name": "Toothpaste",
        "hindi_name": "टूथपेस्ट",
        "aliases": "toothpaste, manjan, colgate, dantkanti, tooth paste, paste",
        "unit": "tube",
        "price": 75.0,
        "stock": 22.0
    }
]


def similarity(a: str, b: str) -> float:
    """Calculate string similarity ratio."""
    return SequenceMatcher(None, a.strip().lower(), b.strip().lower()).ratio()


class CatalogService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db

    def get_all_products(self) -> List[Product]:
        if self.db:
            products = self.db.query(Product).all()
            if products:
                return products
        # In-memory mock products if DB is not yet populated
        result = []
        for i, p in enumerate(SEED_PRODUCTS, 1):
            prod = Product(
                id=i,
                name=p["name"],
                hindi_name=p["hindi_name"],
                aliases=p["aliases"],
                unit=p["unit"],
                price=p["price"],
                stock=p["stock"]
            )
            result.append(prod)
        return result

    def match_product(self, raw_name: str) -> Tuple[Optional[Product], float]:
        """
        Match raw text item against catalog products using alias inclusion & fuzzy matching.
        Returns (matched Product or None, confidence score).
        """
        raw_clean = raw_name.strip().lower()
        if not raw_clean:
            return None, 0.0

        products = self.get_all_products()
        best_match: Optional[Product] = None
        highest_score = 0.0

        for product in products:
            # Check exact match on name or hindi name
            if raw_clean == product.name.lower() or (product.hindi_name and raw_clean == product.hindi_name.lower()):
                return product, 1.0

            # Check aliases
            aliases = [a.strip().lower() for a in product.aliases.split(",") if a.strip()]
            for alias in aliases:
                # Exact alias match
                if raw_clean == alias:
                    return product, 0.98

                # Substring match (e.g. "tel" in "refined tel" or "refined oil" in "1 litre refined oil")
                if alias in raw_clean or raw_clean in alias:
                    score = 0.90 + (0.05 if len(alias) > 3 else 0.0)
                    if score > highest_score:
                        highest_score = score
                        best_match = product

                # Fuzzy similarity
                sim = similarity(raw_clean, alias)
                if sim > highest_score and sim >= 0.70:
                    highest_score = sim
                    best_match = product

            # Also fuzzy match against main product name
            name_sim = similarity(raw_clean, product.name.lower())
            if name_sim > highest_score and name_sim >= 0.70:
                highest_score = name_sim
                best_match = product

        if highest_score >= 0.65:
            return best_match, highest_score

        return None, 0.0

    def check_stock_and_build_items(self, parsed_items_raw: List[Dict]) -> Tuple[List[ParsedOrderItem], List[str], float]:
        """
        Takes raw parsed items: [{'raw_item': str, 'quantity': float, 'unit': str}],
        matches them to catalog, calculates line totals, checks stock, and sums order.
        """
        parsed_items: List[ParsedOrderItem] = []
        unknown_items: List[str] = []
        total_order_amount = 0.0

        for item in parsed_items_raw:
            raw_name = item.get("raw_item", "")
            qty = float(item.get("quantity", 1.0))
            user_unit = item.get("unit", "")

            matched_product, score = self.match_product(raw_name)

            if matched_product:
                # Use catalog unit if user unit is missing or vague
                unit = user_unit if user_unit else matched_product.unit
                unit_price = matched_product.price
                line_total = round(qty * unit_price, 2)
                in_stock = matched_product.stock >= qty

                parsed_items.append(
                    ParsedOrderItem(
                        raw_item=raw_name,
                        matched_product=matched_product.name,
                        quantity=qty,
                        unit=unit,
                        unit_price=unit_price,
                        line_total=line_total,
                        in_stock=in_stock,
                        available_stock=matched_product.stock
                    )
                )
                total_order_amount += line_total
            else:
                unknown_items.append(raw_name)

        return parsed_items, unknown_items, round(total_order_amount, 2)

    @staticmethod
    def generate_hindi_confirmation(items: List[ParsedOrderItem], total: float) -> str:
        """
        Generates a natural, warm Hindi response:
        'Aapka order: 2 kilo chawal aur 1 litre refined oil. Total ₹300. Confirm karein?'
        """
        if not items:
            return "Kripya apna order doharayein, hume koi samaan samajh nahi aaya."

        item_phrases = []
        for it in items:
            # Format quantity nicely (e.g., 2 instead of 2.0, 0.5 as aadha/0.5)
            q_str = str(int(it.quantity)) if it.quantity.is_integer() else str(it.quantity)
            if it.quantity == 0.5:
                q_str = "aadha"

            # Translate units to friendly Hindi/Hinglish
            unit_str = it.unit
            if it.unit == "kg":
                unit_str = "kilo"
            elif it.unit == "litre":
                unit_str = "litre"
            elif it.unit == "packet":
                unit_str = "packet"
            elif it.unit == "bottle":
                unit_str = "bottle"
            elif it.unit == "tube":
                unit_str = "tube"

            item_phrases.append(f"{q_str} {unit_str} {it.matched_product.lower()}")

        if len(item_phrases) == 1:
            items_str = item_phrases[0]
        else:
            items_str = ", ".join(item_phrases[:-1]) + " aur " + item_phrases[-1]

        total_int = int(total) if total.is_integer() else total
        return f"Aapka order: {items_str}. Total ₹{total_int}. Confirm karein?"

