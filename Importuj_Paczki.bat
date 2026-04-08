@echo off
echo ===================================================
echo   AUTOMATYCZNY IMPORT PACZEK (.ZIP) DO GMINA MIEDZNA
echo ===================================================
echo.

echo KROK 1: Rozpakowywanie archiwow i generowanie nowych wpisow...
call node scripts/import-packages.mjs

echo.
echo KROK 2: Sprawdzanie zmian i wysylanie na serwer (Vercel)...
call git add .
call git commit -m "Automatyczna aktualizacja wpisow przez system urzednika"
call git push

echo.
echo ===================================================
echo GOTOWE! Strona za moment zostanie zaktualizowana publicznie.
echo ===================================================
pause
