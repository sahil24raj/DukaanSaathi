from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# Product Schemas
class ProductBase(BaseModel):
    name: str
    hindi_name: Optional[str] = None
    aliases: str
    unit: str
    price: float
    stock: float


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    price: Optional[float] = None
    stock: Optional[float] = None


class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Order Parsing Schemas
class ParsedOrderItem(BaseModel):
    raw_item: str
    matched_product: str
    quantity: float
    unit: str
    unit_price: float
    line_total: float
    in_stock: bool = True
    available_stock: float = 0.0


class ParsedOrderResponse(BaseModel):
    items: List[ParsedOrderItem]
    total: float
    status: str  # "ready_for_confirmation", "partial", "empty", "stock_issue"
    unknown_items: List[str] = []
    hindi_reply: str
    transcript: str
    parse_method: str = "fallback_rules"  # "evon_llm" or "fallback_rules"
    confidence: float = 0.95


class ParseOrderRequest(BaseModel):
    transcript: str


# Transcription Schemas
class TranscribeResponse(BaseModel):
    transcript: str
    language: str = "hi"
    confidence: Optional[float] = 0.95
    processing_time_ms: float
    source: str = "gnani_prisma"


# Order Creation & Storage Schemas
class OrderItemOut(BaseModel):
    id: int
    raw_item: str
    matched_product: str
    quantity: float
    unit: str
    unit_price: float
    line_total: float

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_transcript: Optional[str] = ""
    hindi_response: Optional[str] = ""
    items: List[ParsedOrderItem]


class OrderOut(BaseModel):
    id: int
    customer_transcript: Optional[str]
    hindi_response: Optional[str]
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True


# Dashboard Schemas
class TopProductStat(BaseModel):
    name: str
    units_sold: float
    revenue: float
    unit: str


class DashboardStats(BaseModel):
    total_orders: int
    total_revenue: float
    top_selling_items: List[TopProductStat]
    low_stock_products: List[ProductOut]
    recent_orders: List[OrderOut]


# TTS Schemas
class SpeakRequest(BaseModel):
    text: str
    language: Optional[str] = "hi"


class SpeakResponse(BaseModel):
    audio_base64: Optional[str] = None
    audio_url: Optional[str] = None
    format: str = "wav"
    source: str = "gnani_timbre"
    duration_estimate_sec: Optional[float] = None

