@echo off
title Apagar Servidores - Sistema de Restaurante
echo ==================================================
echo      APAGANDO SERVIDORES DEL RESTAURANTE
echo ==================================================
echo.

echo Deteniendo Backend (Puerto 8000)...
powershell -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo Deteniendo Frontend (Puerto 5173)...
powershell -Command "Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo.
echo ==================================================
echo  ¡Servidores apagados con exito!
echo ==================================================
powershell -Command "Start-Sleep -Seconds 3"
