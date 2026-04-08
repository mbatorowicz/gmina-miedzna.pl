# Instrukcja Obsługi Systemu Treści Gminy Miedzna

## Jak opublikować nowy artykuł ze zdjęciami?
Proces publikowania nowości (takich jak informacje z życia gminy, ostrzeżenia o przerwach w dostawie wody) jest zautomatyzowany. Wystarczą Ci do tego tylko dwie rzeczy na pulpicie:

1. **Skatalogowane foldery/paczki `.zip`** z napisaną treścią.
2. Działający plik wsadowy **`Importuj_Paczki.bat`**.

### KROK 1: Pakowanie materiałów
Poprosiłeś zewnętrzną jednostkę lub napisałeś samodzielnie artykuł w formacie HTML z wykorzystaniem edytora tekstowego, uwzględniając na samej górze odpowiedni znacznik ukryty dla bazy systemu (Tytuł, Autor, Kategoria). 
Przygotowane zdjęcia rzuć obok tego samego pliku do jednego pustego foldera, a następnie spakuj klikając na niego prawym przyciskiem myszy i wybierając funkcję utworzenia *Spakowanego Archiwum ZIP*.

> **Ważne!** Galeria układa się automatycznie – pierwsza po nazwie fotografia w paczce ZAWSZE wyświetli się jako duża "okładka" nagłówka artykułu, a reszta zostanie ułożona na dole!

### KROK 2: Uruchomienie narzędzia publicznego
Przeciągnij gotowe archiwa .ZIP z pulpitu do głównego katalogu tego projektu internetowego (tam gdzie znajduje się okrągła ikona i duża ilosc innych plików).

Gdy paczki są w środku, po prostu **dwukrotnie kliknij w plik `Importuj_Paczki.bat`**.

Otworzy się czarne tło i wypisze historię odbytą przez system Gminy w ułamkach sekund:
1. Rozpakuje przygotowane .ZIP i sczyta Twój tekst.
2. Posegreguje fotografie i wyśle wytyczne do albumu zdjęć galerii.
3. Archiwum ZIP przenesie jako kopię awaryjną do katalogu `archived_packages/`.
4. Wszystkie nowe strony połączy i po cichu wyda rozkaz wysłania paczek internetem do chmury (proces Git Pull/Push).

Otrzymasz komunikat o możliwości zamknięcia okna. Proces budowy przez serwer zacznie się w tle i witryna automatycznie opublikuje ten wpis wszystkim Obywatelom po upływie od 30 do 60 sekund. Gotowe!
