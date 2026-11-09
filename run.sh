#!/usr/bin/env bash
set -e

echo "==================================================="
echo "    Dukaan Saathi (दुकान साथी) - Launch Script"
echo "  Hindi/Hinglish Voice Assistant for Kirana Stores"
echo "==================================================="

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Seeding database..."
python seed.py

echo "Starting backend and frontend..."
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait

