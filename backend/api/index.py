import os
import sys

# Ensure pure Python fallback is used if C extensions are blocked by OS policy
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

# Add the backend root directory to sys.path so 'app' and other modules resolve
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the FastAPI application
from app.main import app

# Export app as handler for Vercel Serverless Function
handler = app

