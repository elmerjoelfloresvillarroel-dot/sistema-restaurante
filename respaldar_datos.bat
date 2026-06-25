@echo off
title Respaldar Datos - Sistema de Restaurante
echo ==================================================
echo      RESPALDANDO DATOS DE LA BASE DE DATOS
echo ==================================================
echo.

echo Guardando datos en respaldo_datos.json...
cd backend_restaurante
..\.venv\Scripts\python.exe manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 4 -o ..\respaldo_datos.json
cd ..

echo.
echo ==================================================
echo  ¡Respaldo completado con exito!
echo  Se ha creado el archivo: respaldo_datos.json
echo ==================================================
powershell -Command "Start-Sleep -Seconds 3"
