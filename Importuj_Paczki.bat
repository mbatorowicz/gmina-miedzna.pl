@echo off
chcp 65001 >nul
color 0B
echo ===================================================
echo   AUTOMATYCZNY IMPORT I PUBLIKACJE - GMINA MIEDZNA
echo ===================================================
echo.

echo [1/3] Przetwarzanie folderu Uploads (Odkodowanie Zip i PDF)...
call node scripts/import-packages.mjs
if %ERRORLEVEL% neq 0 (
    color 4F
    echo ERROR: Skrypt napotkal blad podczas generowania paczek.
    pause
    exit /b
)

echo.
echo [2/3] Kompilacja i budowanie (Wyszukiwanie bledow na powloce)...
call npm run build
if %ERRORLEVEL% neq 0 (
    color 4F
    echo ERROR: Mamy blad w programie Astro! Zatrzymano publikacje, zeby nie zepsuc portalu publicznego. Zglos TO!
    pause
    exit /b
)

echo.
echo [3/3] Synchronizacja C-I. Wysylanie struktury na zewnetrzny glowny serwer...
call git add .
call git commit -m "Aktualizacja paczek/ostrzezen (%date% %time%)"
call git push
if %ERRORLEVEL% neq 0 (
    color 4F
    echo ERROR: Serwer odrzucil nadchodzace komendy (Brak internatu?).
    pause
    exit /b
)

color 2F
echo.
echo ===================================================
echo   SUKCES! Strona automatycznie za ~3 minuty wyswietli nowe dane.
echo ===================================================
pause
