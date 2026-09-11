@echo off
title TraceMail Launcher (SIH26106)
echo ========================================================
echo     TraceMail: AI Email Forensics & GeoTrace Platform
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on port 8000...
start "TraceMail Backend" cmd /k "cd /d %~dp0 && set PYTHONPATH=backend&& py -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting React Frontend on port 5173...
start "TraceMail Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both services are launching in separate windows!
echo - Backend API:  http://localhost:8000 (Swagger: http://localhost:8000/docs)
echo - Frontend App: http://localhost:5173
echo.
pause
