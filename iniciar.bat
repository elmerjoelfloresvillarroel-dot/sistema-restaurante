@echo off
title Iniciar Sistema de Restaurante
echo ==================================================
echo      INICIANDO SISTEMA DE RESTAURANTE
echo ==================================================
echo.

:: Configurar ruta local de Node para el Frontend
set PATH=%~dp0.node;%PATH%

:: Iniciar el Backend (Django) en una nueva ventana
echo [1/2] Iniciando backend de Django en una nueva ventana...
start "Backend - Django" cmd /k "cd backend_restaurante && ..\.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000"

:: Iniciar el Frontend (React + Vite) en una nueva ventana
echo [2/2] Iniciando frontend de React en una nueva ventana...
start "Frontend - React" cmd /k "cd frontend && npm.cmd run dev -- --host"

echo.
echo ==================================================
echo  ¡Ambos servidores se estan iniciando!
echo  - API Backend:  http://0.0.0.0:8000 (Local)
echo  - Frontend UI:  http://localhost:5173
echo.
echo  Para conectar desde tu telefono (mismo Wi-Fi):
echo  1. Busca la IP local de tu PC en la lista de abajo
echo  2. Entra en tu telefono a: http://[TU_IP]:5173
echo ==================================================
echo Tus IPs locales detectadas:
powershell -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | ForEach-Object { write-host ' -> http://' $_.IPAddress ':5173' -ForegroundColor Green }"
echo ==================================================
powershell -Command "Start-Sleep -Seconds 5"
