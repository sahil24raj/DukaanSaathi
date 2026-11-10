import sys
import os
import unittest

# Ensure directories are in sys.path
root_dir = os.path.abspath(os.path.dirname(__file__))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Run seed first
try:
    from seed import run_seed
    run_seed()
except Exception as e:
    print(f"Seed notice: {e}")

# Load test case
from backend.tests.test_api import TestDukaanSaathiAPI

if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestDukaanSaathiAPI)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    if not result.wasSuccessful():
        print(f"FAILED: {len(result.failures)} failures, {len(result.errors)} errors")
        sys.exit(1)
        
    print("ALL TESTS PASSED SUCCESSFULLY!")
    sys.exit(0)
