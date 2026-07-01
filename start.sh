#!/bin/bash

echo "🎬 Starting Netflix Clone..."
echo "============================"

# Kill any existing processes on ports 3000 and 5000
kill $(lsof -t -i:3000) 2>/dev/null
kill $(lsof -t -i:5000) 2>/dev/null

# Start backend
echo "📡 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to initialize
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Netflix Clone is running!"
echo "📡 Backend:  http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
