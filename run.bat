@echo off
echo ===================================================
echo     Dukaan Saathi (दुकान साथी) - Launch Script
echo   Hindi/Hinglish Voice Assistant for Kirana Stores
echo ===================================================

echo.
echo [1/3] Checking environment configuration...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)

echo.
echo [2/3] Seeding database...
python seed.py

echo.
echo [3/3] Starting backend server and frontend...
echo Starting backend server on http://localhost:8000 ...
start "Dukaan Saathi Backend" cmd /k "python -m uvicorn main:app --reload --port 8000"

echo Starting frontend on http://localhost:5173 ...
cd frontend
npm run dev
