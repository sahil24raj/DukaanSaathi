import sys
import os
import unittest
import traceback

# Ensure unbuffered output safely
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(line_buffering=True)
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(line_buffering=True)
except Exception:
    pass

# Ensure directories are in sys.path
root_dir = os.path.abspath(os.path.dirname(__file__))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

print("=" * 60)
print("DUKAAN SAATHI BACKEND CI TEST RUNNER")
print(f"Working directory: {os.getcwd()}")
print(f"Python: {sys.version}")
print(f"sys.path: {sys.path[:4]}")
print("=" * 60)

# 1. Run database seed
print("\n--- STEP 1: Running Database Seeder ---")
try:
    from seed import run_seed
    run_seed()
    print("Database seed completed successfully.")
except Exception as e:
    print(f"Database seed exception: {e}")
    traceback.print_exc()

# 2. Import Test Suite
print("\n--- STEP 2: Importing Test Suite ---")
test_class = None
try:
    from backend.tests.test_api import TestDukaanSaathiAPI
    test_class = TestDukaanSaathiAPI
    print("Successfully imported TestDukaanSaathiAPI from backend.tests.test_api")
except Exception as e1:
    print(f"Notice: import from backend.tests.test_api failed: {e1}")
    try:
        from tests.test_api import TestDukaanSaathiAPI
        test_class = TestDukaanSaathiAPI
        print("Successfully imported TestDukaanSaathiAPI from tests.test_api")
    except Exception as e2:
        print(f"Fatal: failed to import TestDukaanSaathiAPI: {e2}")
        traceback.print_exc()
        sys.exit(1)

# 3. Execute Tests
print("\n--- STEP 3: Executing Unit Tests ---")
if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(stream=sys.stdout, verbosity=2)
    result = runner.run(suite)
    
    sys.stdout.flush()
    sys.stderr.flush()
    
    print("\n" + "=" * 60)
    if not result.wasSuccessful():
        print(f"FAILED: {len(result.failures)} failures, {len(result.errors)} errors")
        for f in result.failures:
            print(f"FAIL: {f[0]}")
            print(f[1])
        for err in result.errors:
            print(f"ERROR: {err[0]}")
            print(err[1])
        sys.exit(1)
        
    print("ALL 7 TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)
    sys.exit(0)
