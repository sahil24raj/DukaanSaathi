import os
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import Product
from .routers import products, voice, orders, dashboard
from .services.catalog import SEED_PRODUCTS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("dukaan_saathi")

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty on startup
def auto_seed_products():
    db = SessionLocal()
    try:
        count = db.query(Product).count()
        if count == 0:
            logger.info("Initializing product catalog with seed data...")
            for item in SEED_PRODUCTS:
                prod = Product(
                    name=item["name"],
                    hindi_name=item["hindi_name"],
                    aliases=item["aliases"],
                    unit=item["unit"],
                    price=item["price"],
                    stock=item["stock"]
                )
                db.add(prod)
            db.commit()
            logger.info(f"Seeded {len(SEED_PRODUCTS)} initial kirana products.")
    except Exception as e:
        logger.error(f"Error during auto-seed: {e}")
    finally:
        db.close()

auto_seed_products()

app = FastAPI(
    title="Dukaan Saathi API",
    description="Voice Assistant for Indian Kirana Stores powered by Gnani AI (Prisma v2.5 STT, Timbre v2.5 TTS)",
    version="1.0.0"
)

# Configure CORS for local development with Vite / React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router)
app.include_router(voice.router)
app.include_router(orders.router)
app.include_router(dashboard.router)


@app.get("/")
@app.get("/api")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "Dukaan Saathi",
        "service": "Voice AI Kirana Assistant"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
