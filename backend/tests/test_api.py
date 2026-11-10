import os
import sys
import unittest
from fastapi.testclient import TestClient

os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

# Add both backend and project root to sys.path consistently
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.main import app

class TestDukaanSaathiAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            from seed import run_seed
            run_seed()
        except Exception as e:
            print("Notice during test seed:", e)
        cls.client = TestClient(app)

    def test_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get("status"), "healthy")

    def test_get_products(self):
        res = self.client.get("/api/products")
        self.assertEqual(res.status_code, 200)
        products = res.json()
        self.assertGreaterEqual(len(products), 10)
        names = [p["name"] for p in products]
        self.assertIn("Chawal", names)
        self.assertIn("Atta", names)
        self.assertIn("Refined Oil", names)

    def test_parse_order_standard(self):
        payload = {"transcript": "Bhaiya, do kilo chawal aur ek litre refined oil chahiye."}
        res = self.client.post("/api/parse-order", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ready_for_confirmation")
        self.assertEqual(data["total"], 300.0)
        self.assertEqual(len(data["items"]), 2)
        self.assertEqual(data["items"][0]["matched_product"], "Chawal")
        self.assertEqual(data["items"][0]["quantity"], 2.0)
        self.assertEqual(data["items"][1]["matched_product"], "Refined Oil")
        self.assertEqual(data["items"][1]["quantity"], 1.0)
        self.assertIn("300", data["hindi_reply"])

    def test_parse_order_hindi_numerals(self):
        payload = {"transcript": "paanch kg atta aur do packet biscuit dena"}
        res = self.client.post("/api/parse-order", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total"], 265.0)
        self.assertEqual(len(data["items"]), 2)

    def test_speak_endpoint(self):
        payload = {"text": "Aapka order: 2 kilo chawal. Total ₹120. Confirm karein?"}
        res = self.client.post("/api/speak", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsNotNone(data.get("audio_base64"))
        self.assertEqual(data.get("format"), "wav")

    def test_demo_samples(self):
        res = self.client.get("/api/demo-samples")
        self.assertEqual(res.status_code, 200)
        samples = res.json()
        self.assertEqual(len(samples), 4)

    def test_dashboard_metrics(self):
        res = self.client.get("/api/dashboard")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_orders", data)
        self.assertIn("total_revenue", data)
        self.assertIn("top_selling_items", data)

if __name__ == "__main__":
    unittest.main()

