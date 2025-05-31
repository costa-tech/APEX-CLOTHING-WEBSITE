@echo off
echo Starting Clothing Brand E-commerce Development Environment
echo.

REM Start Backend Server
echo Starting Backend Server on Port 5000...
start "Backend Server" cmd /k "cd /d \"c:\Users\COSTA\Desktop\Clothing Brand\Backend\" && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend Server
echo Starting Frontend Server on Port 3001...
start "Frontend Server" cmd /k "cd /d \"c:\Users\COSTA\Desktop\Clothing Brand\Frontend\" && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3001
echo.
echo Press any key to continue...
pause > nul
