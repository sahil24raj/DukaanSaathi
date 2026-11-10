import sys
import os
import io
import unittest
import traceback
import atexit

output_buffer = io.StringIO()

def on_exit():
    full_log = output_buffer.getvalue()
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        try:
            with open(summary_file, "a", encoding="utf-8") as f:
                f.write("### Dukaan Saathi Test Run Execution\n\n```text\n" + full_log + "\n```\n")
        except Exception as e:
            print("Failed to write to GITHUB_STEP_SUMMARY:", e)

atexit.register(on_exit)

def log(msg):
    print(msg)
    output_buffer.write(str(msg) + "\n")

# Ensure directories are in sys.path
root_dir = os.path.abspath(os.path.dirname(__file__))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

log(f"Current working dir: {os.getcwd()}")
log(f"sys.path: {sys.path[:4]}")

# 1. Run database seed
try:
    from seed import run_seed
    run_seed()
    log("Database seed completed.")
except Exception as e:
    log(f"Database seed notice: {e}")
    traceback.print_exc(file=output_buffer)
    traceback.print_exc()

# 2. Import Test Suite
test_class = None
try:
    from backend.tests.test_api import TestDukaanSaathiAPI
    test_class = TestDukaanSaathiAPI
    log("Successfully imported TestDukaanSaathiAPI from backend.tests.test_api.")
except Exception as e1:
    log(f"Failed backend.tests.test_api import: {e1}")
    try:
        from tests.test_api import TestDukaanSaathiAPI
        test_class = TestDukaanSaathiAPI
        log("Successfully imported TestDukaanSaathiAPI from tests.test_api.")
    except Exception as e2:
        log(f"Failed tests.test_api import: {e2}")
        traceback.print_exc(file=output_buffer)
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(stream=output_buffer, verbosity=2)
    result = runner.run(suite)
    
    test_output = output_buffer.getvalue()
    print(test_output)
    
    if not result.wasSuccessful():
        log(f"TEST RUN FAILED: {len(result.failures)} failures, {len(result.errors)} errors")
        sys.exit(1)
        
    log("ALL TESTS PASSED SUCCESSFULLY!")
    sys.exit(0)
