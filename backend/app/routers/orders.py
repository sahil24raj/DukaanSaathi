from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Order, OrderItem, Product
from ..schemas import OrderCreate, OrderOut

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("", response_model=OrderOut)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """
    Validates inventory stock, saves the confirmed order, decrements product stock,
    and returns the saved order record.
    """
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order contains no items.")

    # 1. Validate stock availability
    for item in order_data.items:
        prod = db.query(Product).filter(Product.name == item.matched_product).first()
        if prod and prod.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {prod.name}. Available: {prod.stock} {prod.unit}, Requested: {item.quantity}"
            )

    # 2. Calculate total and create Order
    total_amount = sum(it.line_total for it in order_data.items)

    new_order = Order(
        customer_transcript=order_data.customer_transcript,
        hindi_response=order_data.hindi_response,
        total_amount=round(total_amount, 2),
        status="confirmed"
    )
    db.add(new_order)
    db.flush()  # Populates new_order.id

    # 3. Create OrderItems & decrement stock
    for item in order_data.items:
        prod = db.query(Product).filter(Product.name == item.matched_product).first()
        prod_id = prod.id if prod else None

        if prod:
            prod.stock = max(0.0, prod.stock - item.quantity)

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=prod_id,
            raw_item=item.raw_item,
            matched_product=item.matched_product,
            quantity=item.quantity,
            unit=item.unit,
            unit_price=item.unit_price,
            line_total=item.line_total
        )
        db.add(order_item)

    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("", response_model=List[OrderOut])
def get_orders(limit: int = 50, db: Session = Depends(get_db)):
    """Returns recent orders sorted by most recent first."""
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(limit).all()
    return orders


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Fetch details of a specific order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{order_id}")
def delete_order(order_id: int, refund_stock: bool = True, db: Session = Depends(get_db)):
    """Cancel or delete an order, with optional stock restitution."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if refund_stock:
        for item in order.items:
            if item.product_id:
                prod = db.query(Product).filter(Product.id == item.product_id).first()
                if prod:
                    prod.stock += item.quantity
    
    db.delete(order)
    db.commit()
    return {"status": "success", "message": f"Order #{order_id} cancelled successfully"}

