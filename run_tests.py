import sys
import os
import io
import unittest
import traceback

# Ensure directories are in sys.path
root_dir = os.path.abspath(os.path.dirname(__file__))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

output_buffer = io.StringIO()

def log(msg):
    print(msg)
    output_buffer.write(msg + "\n")

log(f"Current working dir: {os.getcwd()}")
log(f"sys.path: {sys.path[:3]}")

# Run seed first
try:
    from seed import run_seed
    run_seed()
    log("Seed executed successfully.")
except Exception as e:
    log(f"Seed notice: {e}")
    traceback.print_exc()

# Load test case
try:
    from backend.tests.test_api import TestDukaanSaathiAPI
    log("Successfully imported TestDukaanSaathiAPI.")
except Exception as e:
    log(f"Import error for TestDukaanSaathiAPI: {e}")
    traceback.print_exc(file=output_buffer)
    traceback.print_exc()
    sys.exit(1)

if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestDukaanSaathiAPI)
    runner = unittest.TextTestRunner(stream=output_buffer, verbosity=2)
    result = runner.run(suite)
    
    full_output = output_buffer.getvalue()
    print(full_output)
    
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        try:
            with open(summary_file, "a", encoding="utf-8") as f:
                f.write("### Dukaan Saathi Backend Test Results\n\n```text\n" + full_output + "\n```\n")
        except Exception as se:
            print("Failed to write to GITHUB_STEP_SUMMARY:", se)

    if not result.wasSuccessful():
        print(f"FAILED: {len(result.failures)} failures, {len(result.errors)} errors")
        sys.exit(1)
        
    print("ALL TESTS PASSED SUCCESSFULLY!")
    sys.exit(0)
