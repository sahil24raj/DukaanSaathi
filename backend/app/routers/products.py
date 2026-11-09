from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Product
from ..schemas import ProductOut, ProductUpdate, ProductCreate
from ..services.catalog import SEED_PRODUCTS

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=List[ProductOut])
def get_products(db: Session = Depends(get_db)):
    """Return all products in the catalog with current stock and prices."""
    products = db.query(Product).order_by(Product.name).all()
    if not products:
        # Auto-seed if empty
        seed_catalog_internal(db)
        products = db.query(Product).order_by(Product.name).all()
    return products


@router.put("/{product_id}", response_model=ProductOut)
def update_product_stock(product_id: int, update_data: ProductUpdate, db: Session = Depends(get_db)):
    """Update stock or price for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if update_data.stock is not None:
        product.stock = max(0.0, update_data.stock)
    if update_data.price is not None:
        product.price = max(0.0, update_data.price)

    db.commit()
    db.refresh(product)
    return product


@router.post("/seed")
def seed_catalog(db: Session = Depends(get_db)):
    """Seed or reseed the default 10 kirana products."""
    count = seed_catalog_internal(db)
    return {"status": "success", "message": f"Seeded {count} products successfully."}


def seed_catalog_internal(db: Session) -> int:
    added = 0
    for item in SEED_PRODUCTS:
        existing = db.query(Product).filter(Product.name == item["name"]).first()
        if not existing:
            prod = Product(
                name=item["name"],
                hindi_name=item["hindi_name"],
                aliases=item["aliases"],
                unit=item["unit"],
                price=item["price"],
                stock=item["stock"]
            )
            db.add(prod)
            added += 1
    db.commit()
    return added

