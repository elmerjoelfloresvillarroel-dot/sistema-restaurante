@echo off
title Restaurar Datos - Sistema de Restaurante
echo ==================================================
echo      RESTAURANDO DATOS DE LA BASE DE DATOS
echo ==================================================
echo.

if not exist respaldo_datos.json (
    echo [ERROR] No se encontro el archivo respaldo_datos.json en esta carpeta.
    echo Asegurate de haber copiado el archivo de respaldo antes de restaurar.
    echo.
    pause
    exit /b
)

echo Cargando datos desde respaldo_datos.json...
cd backend_restaurante
..\.venv\Scripts\python.exe manage.py loaddata ..\respaldo_datos.json
cd ..

echo.
echo ==================================================
echo  ¡Datos restaurados con exito en la base de datos!
echo ==================================================
powershell -Command "Start-Sleep -Seconds 3"
