import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import slugify from 'slugify';

const ROOT_DIR = process.cwd();
const INBOX_DIR = path.join(ROOT_DIR, 'public', 'uploads');
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content', 'news');
const ARCHIVAL_DIR = path.join(ROOT_DIR, 'archived_packages');

// Tworzymy niezbędne foldery jeśli nie istnieją
if (!fs.existsSync(INBOX_DIR)) fs.mkdirSync(INBOX_DIR, { recursive: true });
if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
if (!fs.existsSync(ARCHIVAL_DIR)) fs.mkdirSync(ARCHIVAL_DIR, { recursive: true });

const files = fs.readdirSync(INBOX_DIR);
const zipFiles = files.filter(f => f.startsWith('PACZKA_') && f.endsWith('.zip'));

if (zipFiles.length === 0) {
  console.log('Nie znaleziono nowych paczek ZIP (Wpisy) do przetworzenia w public/uploads/');
} else {
  console.log(`Znaleziono ${zipFiles.length} paczek do przetworzenia w Inboxie.`);

for (const zipFile of zipFiles) {
  const zipPath = path.join(INBOX_DIR, zipFile);
  console.log(`Przetwarzanie: ${zipFile}...`);

  try {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    
    // Szukamy głównego pliku .html
    const htmlEntry = zipEntries.find(e => e.entryName.endsWith('.html') && !e.entryName.includes('/'));
    
    if (!htmlEntry) {
      console.warn(`Pominięto ${zipFile}: Brak pliku HTML w głównym katalogu.`);
      continue;
    }

    const htmlContent = htmlEntry.getData().toString('utf8');
    
    // Parsowanie metadanych z zkomentowanego nagłówka HTML
    const getMeta = (key) => {
      const match = htmlContent.match(new RegExp(`${key}:\\s*(.+)`));
      return match ? match[1].trim() : '';
    };

    const title = getMeta('TYTUŁ') || 'Brak Tytułu';
    const author = getMeta('AUTOR') || 'Administrator';
    let dateStr = getMeta('DATA'); // "28.02.2026, 23:46:15"
    let date = new Date().toISOString();
    
    if (dateStr) {
        // Konwersja "DD.MM.YYYY, HH:MM:SS" do ISO uwzględniająca czas
        const splitDate = dateStr.split(',');
        const datePart = splitDate[0].trim();
        const timePart = splitDate[1] ? splitDate[1].trim() : '00:00:00';
        
        const parts = datePart.split('.');
        if (parts.length === 3) {
            // Składamy prawidłową datę wymaganą dla Javascript (YYYY-MM-DDTHH:MM:SS)
            // Używamy bezpiecznej konwersji + dopisujemy Z dla trzymania standardu jeśli nie podano strefy
            let isoTime = timePart;
            if (isoTime.split(':').length === 2) isoTime += ':00';
            
            try {
                date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${isoTime}+00:00`).toISOString();
            } catch(e) {
                // W razie błędu parsowania nietypowej godziny ignoruj godzinę
                date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
            }
        }
    }

    // Jeśli kategoria jest przekazywana w nagłówku, bierzemy ją, w przeciwnym razie aktualności
    const categoryRaw = getMeta('KATEGORIA') || 'aktualności';
    // Kategoria jako bezpieczny string (lowercase z myślnikami, ułatwi to routing)
    const categorySlug = slugify(categoryRaw, { lower: true, strict: true });
    const categoryName = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);

    const pinnedStr = getMeta('PRZYPIĘTE');
    const isPinned = pinnedStr && pinnedStr.toLowerCase().includes('tak');

    // Slug dla samego wpisu - dodajemy losowy hash by zablokować nadpisywanie
    const slugBase = slugify(title, { lower: true, strict: true, locale: 'pl' });
    const uniqueHash = Math.random().toString(36).substring(2, 7);
    const slug = `${slugBase}-${uniqueHash}`;
    // Folder docelowy dla danego artykułu (połączony wpis + zdjęcia - technika co-location Astro)
    const postDir = path.join(CONTENT_DIR, slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    // Wyciąganie komentarza na górze, by zostawić samą czystą treść HTML
    const cleanContent = htmlContent.replace(/<!--[\s\S]*?-->/, '').trim();
    
    // Podmiana ścieżek do obrazków: media/image.jpg -> ./image.jpg
    const finalContent = cleanContent.replace(/src="media\//g, 'src="./');

    // Znajdź główny obrazek (okładkę postu) i resztę do galerii
    const mediaEntries = zipEntries.filter(e => e.entryName.startsWith('media/') && !e.isDirectory);
    
    mediaEntries.forEach(mediaEntry => {
        const mediaFileName = path.basename(mediaEntry.entryName);
        const destPath = path.join(postDir, mediaFileName);
        // Zapisz każdy obrazek do docelowego folderu
        fs.writeFileSync(destPath, mediaEntry.getData());
    });

    const validImages = mediaEntries
        .map(e => path.basename(e.entryName))
        .filter(img => img.match(/\.(jpg|jpeg|png)$/i))
        .sort(); // Sortowanie alfabetyczne (gwarancja że 01_ wpada na okładkę)

    const coverImage = validImages.length > 0 ? `./${validImages[0]}` : '';
    const galleryImages = validImages.length > 1 ? validImages.slice(1).map(img => `"./${img}"`) : [];

    // Przygotuj format pliku dla systemu Astro (Markdown z Frontmatter)
    const markdownOutput = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
author: "${author}"
category: "${categorySlug}"
categoryName: "${categoryName}"
${coverImage ? `coverImage: "${coverImage}"` : ''}
${galleryImages.length > 0 ? `galleryImages: [${galleryImages.join(', ')}]` : ''}
${isPinned ? 'pinned: true' : ''}
---

${finalContent}
`;

    // Zapisz Markdown w folderze jako plik główny artykułu (Astro to przetworzy z MDX/MD)
    fs.writeFileSync(path.join(postDir, 'index.md'), markdownOutput);

    console.log(`✅ Utworzono wpis: ${title} [Kategoria: ${categoryName}] -> src/content/news/${slug}/`);

    // Przenieś paczkę do archiwum
    const archivePath = path.join(ARCHIVAL_DIR, zipFile);
    fs.renameSync(zipPath, archivePath);

  } catch (error) {
    console.error(`❌ Błąd przetwarzania ${zipFile}:`, error);
  }
}
} // Koniec bloku else

// --- SEKCJA OSTRZEŻEŃ METEOROLOGICZNYCH ---
console.log('');
console.log('Sprawdzanie ostrzeżeń meteorologicznych w PDF...');

const pdfFiles = files.filter(f => f.startsWith('MZW_STAN_') && f.endsWith('.pdf'));

if (pdfFiles.length > 0) {
  pdfFiles.sort((a, b) => b.localeCompare(a));
  const latestPdf = pdfFiles[0];
  
  console.log(`Zaleziono ${pdfFiles.length} ostrzeżeń. Najnowsze to: ${latestPdf}`);
  
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const pdfParse = require('pdf-parse');
    
    const pdfBuffer = fs.readFileSync(path.join(INBOX_DIR, latestPdf));
    const data = await pdfParse(pdfBuffer);
    
    const warningsList = [];
    const parts = data.text.split("Zjawisko/Stopień zagrożenia");
    
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        let threat = "";
        let validity = "";
        let area = "";
        
        const startOfRest = part.indexOf("Obszar");
        if (startOfRest !== -1) {
            threat = part.substring(0, startOfRest).trim().split('\n')[0];
        } else {
            threat = part.substring(0, 100).trim().split('\n')[0] + "...";
        }
        
        const areaMatch = part.match(/powiaty:\s*([\s\S]*?)(?=Ważność)/);
        if (areaMatch) {
            area = areaMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        }
        
        const waznoscIndex = part.indexOf("Ważność");
        const prawdIndex = part.indexOf("Prawdopodobieństwo");
        if (waznoscIndex !== -1 && prawdIndex !== -1) {
            validity = part.substring(waznoscIndex + 7, prawdIndex).trim().replace(/\n/g, ' ');
        } else if (waznoscIndex !== -1) {
            const prefixEnd = part.substring(waznoscIndex + 7);
            validity = prefixEnd.substring(0, Math.min(prefixEnd.length, 100)).trim().replace(/\n/g, ' ');
        }
        
        if (threat) {
            warningsList.push({ threat, validity, area });
        }
    }
    
    const dataDir = path.join(ROOT_DIR, 'src', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    fs.writeFileSync(
        path.join(dataDir, 'latest-warning.json'),
        JSON.stringify({ file: latestPdf, warningsList }, null, 2)
    );
    console.log(`Pomyślnie zdekodowano tabelę z PDF dla: ${latestPdf}. Wyodrębniono ${warningsList.length} stref zagrożeń.`);

  } catch (err) {
    console.error('Błąd podczas parsowania ostrzeżeń PDF:', err);
  }
}

console.log('Zakończono import paczek oraz skanowanie public/uploads.');
