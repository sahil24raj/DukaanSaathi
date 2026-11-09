from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from ..database import get_db
from ..models import Order, OrderItem, Product
from ..schemas import DashboardStats, TopProductStat, ProductOut, OrderOut
from ..config import settings

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Returns high-level business analytics: total orders, total revenue,
    top selling items, low stock warnings, and recent orders.
    """
    # 1. Total orders & revenue
    total_orders = db.query(Order).count()
    revenue_res = db.query(func.sum(Order.total_amount)).scalar()
    total_revenue = float(revenue_res or 0.0)

    # 2. Top-selling items
    top_items_query = (
        db.query(
            OrderItem.matched_product,
            OrderItem.unit,
            func.sum(OrderItem.quantity).label("total_qty"),
            func.sum(OrderItem.line_total).label("total_rev")
        )
        .group_by(OrderItem.matched_product, OrderItem.unit)
        .order_by(func.sum(OrderItem.line_total).desc())
        .limit(5)
        .all()
    )

    top_selling = [
        TopProductStat(
            name=row[0],
            unit=row[1],
            units_sold=float(row[2] or 0),
            revenue=round(float(row[3] or 0), 2)
        )
        for row in top_items_query
    ]

    # If no orders yet, populate top products with sample catalog previews
    if not top_selling:
        sample_prods = db.query(Product).limit(3).all()
        top_selling = [
            TopProductStat(name=p.name, unit=p.unit, units_sold=0.0, revenue=0.0)
            for p in sample_prods
        ]

    # 3. Low-stock products (< 10 units)
    low_stock_prods = (
        db.query(Product)
        .filter(Product.stock < 10.0)
        .order_by(Product.stock.asc())
        .all()
    )

    # 4. Recent orders (latest 5)
    recent_orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return DashboardStats(
        total_orders=total_orders,
        total_revenue=round(total_revenue, 2),
        top_selling_items=top_selling,
        low_stock_products=low_stock_prods,
        recent_orders=recent_orders
    )


@router.get("/system-status")
def get_system_status():
    """
    Returns configuration and connection health for Gnani APIs.
    Used by frontend to display status banner and helpful guidance.
    """
    return {
        "app_name": "Dukaan Saathi",
        "version": "1.0.0",
        "gnani_api_key_configured": settings.has_gnani_key,
        "evon_api_key_configured": settings.has_evon_key,
        "mock_mode_active": settings.MOCK_GNANI_APIS or not settings.has_gnani_key,
        "stt_engine": "Gnani Prisma v2.5" if settings.has_gnani_key else "Gnani Prisma v2.5 (High-fidelity Mock Adapter)",
        "tts_engine": "Gnani Timbre v2.5" if settings.has_gnani_key else "Gnani Timbre v2.5 (Local Voice Synth)",
        "parser_engine": "Gnani Evon v3.3 LLM" if settings.has_evon_key else "Deterministic Rule-based Hindi/Hinglish Parser",
        "endpoints": {
            "stt": settings.GNANI_STT_ENDPOINT,
            "tts": settings.GNANI_TTS_ENDPOINT,
            "evon": settings.EVON_ENDPOINT
        }
    }

