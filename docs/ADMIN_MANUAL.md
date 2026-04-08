# Podręcznik Instalacji i Edycji - Gmina Miedzna

Ten przewodnik przeznaczony jest dla deweloperów lub administratorów pracujących w kodzie źródłowym strony internetowej. Serwis powstał w technologii **Astro.js** i opiera się o bezserwerową bazę danych generowaną na etapie kompilacji (tzw. architekturę SSG).

## 1. Struktura Katalogów i SSOT (Single Source of Truth)
Zastosowaliśmy strukturę odseparowanych danych, aby wykluczyć uciążliwe wyszukiwanie plików podczas zarządzania zmianami po latach:
- **Konfiguracja Ogólna**: Aby zmienić numer telefonu, stawkę podatkową lub NIP wyświetlający się na wielu połączonych stronach, edytuj zmienne w pliku `src/config/site.ts`.
- **Nawigacja (Mega Menu)**: Tablica w formacie JSON odpowiedzialna za rozwijane menu Gminy i kafelki Odpadów leży w `src/config/navigation.ts`. Edycja polega jedynie na dopisywaniu wierszy wedle struktury: `{ label: "Nowy link", href: "/nowy-link" }`. Nie modyfikuj samej mechaniki menu w komponentach!
- **Kolorystyka**: Kolory weryfikowane przez WCAG ukryto pod zmiennymi z prefiksem `--color-slate...` i `--color-primary...` zdefiniowanymi w pliku `src/styles/global.css`. Żaden komponent podrzędny nie powinien używać kodów `hexa (#)` wpisanych bezpośrednio w arkusz stylów.

## 2. Podział Stron

W witrynie spotkasz się z dwoma modelami wdrażania treści nawigacyjnych:

### Strony Statyczne (Astro Pages)
Zarezerwowane dla podstron takich jak RODO, deklaracja dostępności, czy dane kontaktowe (nie posiadają określonej daty ważności).
Znajdziesz je w `src/pages/`. By połączyć nowo utworzony plik z wyglądem Urzędu wystarczy umieścić go w szkielecie:
```astro
---
import Layout from '../layouts/Layout.astro';
import Sidebar from '../components/Sidebar.astro';
---
<Layout title="Tytuł podstrony">
<!-- Treść podstrony -->
<Sidebar />
</Layout>
```

### Strony Dynamiczne (Kolekcje)
Generują się automatycznie z zaciągniętych przez urzędników pakietów ZIP i lądują jako foldery z zawartym wewnątrz Markdownem w `src/content/news/`. Budowane są przez ścieżki w pliku obsługi błędów 404 typu catch-all wewnątrz `src/pages/[category]/[slug].astro`.

## 3. Kompilacja Automatyczna (GitOps)
Kod został zintegrowany z systemem Vercel. Aktualizacja odbywa się z użyciem repozytorium zdalnego Git (`git push`), a ewentualne errory (np. ze znakiem nowej składni Astro 5) będą jawnie wylistowane w panelu "Deployments" na Vercelu. Logi deweloperskie u użytkownika nie zostają zatrzymywane w architekturze produkcyjnej.
