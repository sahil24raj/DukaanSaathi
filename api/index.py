import os
import sys

# Ensure pure Python fallback is used if C extensions are blocked by OS policy
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

# Add the backend directory to sys.path so 'app' and other modules resolve
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

handler = app
