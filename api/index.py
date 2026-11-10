import os
import sys

# Ensure pure Python fallback is used if C extensions are blocked by OS policy
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

# Add both possible backend paths to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_backend = os.path.abspath(os.path.join(current_dir, "..", "backend"))
root_backend = os.path.abspath("backend")

for p in [parent_backend, root_backend]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

from app.main import app

# Export WSGI/ASGI handler for Vercel
handler = app
app = app
