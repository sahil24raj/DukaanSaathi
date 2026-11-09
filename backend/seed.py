"""
Seed script for Dukaan Saathi
Initializes SQLite database with standard Kirana store product catalog and sample orders.
Usage:
    python seed.py
"""
import sys
import os

# Ensure pure Python fallback is used if C extensions are blocked by OS policy
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from datetime import datetime, timedelta

sys.path.append(os.path.dirname(__file__))

from app.database import engine, Base, SessionLocal
from app.models import Product, Order, OrderItem
from app.services.catalog import SEED_PRODUCTS

def run_seed():
    print("🌱 Initializing Dukaan Saathi Database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("📦 Seeding product catalog...")
        for p_data in SEED_PRODUCTS:
            existing = db.query(Product).filter(Product.name == p_data["name"]).first()
            if not existing:
                prod = Product(
                    name=p_data["name"],
                    hindi_name=p_data["hindi_name"],
                    aliases=p_data["aliases"],
                    unit=p_data["unit"],
                    price=p_data["price"],
                    stock=p_data["stock"]
                )
                db.add(prod)
                print(f"  + Added product: {p_data['name']} (₹{p_data['price']}/{p_data['unit']})")
            else:
                existing.stock = p_data["stock"]
                existing.price = p_data["price"]
                existing.aliases = p_data["aliases"]
                existing.hindi_name = p_data["hindi_name"]
                print(f"  ✓ Updated product: {p_data['name']} (Stock: {p_data['stock']})")

        db.commit()

        order_count = db.query(Order).count()
        if order_count == 0:
            print("📋 Seeding demo sample orders for dashboard...")
            order1 = Order(
                customer_transcript="Bhaiya, do kilo chawal aur ek litre refined oil chahiye.",
                hindi_response="Aapka order: 2 kilo chawal aur 1 litre refined oil. Total ₹300. Confirm karein?",
                total_amount=300.0,
                status="confirmed",
                created_at=datetime.utcnow() - timedelta(hours=2)
            )
            db.add(order1)
            db.flush()

            prod_chawal = db.query(Product).filter(Product.name == "Chawal").first()
            prod_oil = db.query(Product).filter(Product.name == "Refined Oil").first()

            item1_1 = OrderItem(
                order_id=order1.id,
                product_id=prod_chawal.id if prod_chawal else None,
                raw_item="chawal",
                matched_product="Chawal",
                quantity=2.0,
                unit="kg",
                unit_price=60.0,
                line_total=120.0
            )
            item1_2 = OrderItem(
                order_id=order1.id,
                product_id=prod_oil.id if prod_oil else None,
                raw_item="refined oil",
                matched_product="Refined Oil",
                quantity=1.0,
                unit="litre",
                unit_price=180.0,
                line_total=180.0
            )
            db.add_all([item1_1, item1_2])

            order2 = Order(
                customer_transcript="paanch kg atta aur do packet biscuit dena",
                hindi_response="Aapka order: 5 kilo atta aur 2 packet biscuit. Total ₹265. Confirm karein?",
                total_amount=265.0,
                status="confirmed",
                created_at=datetime.utcnow() - timedelta(minutes=45)
            )
            db.add(order2)
            db.flush()

            prod_atta = db.query(Product).filter(Product.name == "Atta").first()
            prod_biscuit = db.query(Product).filter(Product.name == "Biscuit").first()

            item2_1 = OrderItem(
                order_id=order2.id,
                product_id=prod_atta.id if prod_atta else None,
                raw_item="atta",
                matched_product="Atta",
                quantity=5.0,
                unit="kg",
                unit_price=45.0,
                line_total=225.0
            )
            item2_2 = OrderItem(
                order_id=order2.id,
                product_id=prod_biscuit.id if prod_biscuit else None,
                raw_item="biscuit",
                matched_product="Biscuit",
                quantity=2.0,
                unit="packet",
                unit_price=20.0,
                line_total=40.0
            )
            db.add_all([item2_1, item2_2])

            db.commit()
            print("  ✓ Created 2 sample kirana orders.")

        print("\n🎉 Seed completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
