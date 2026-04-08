import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import slugify from 'slugify';

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content', 'news');
const ARCHIVAL_DIR = path.join(ROOT_DIR, 'archived_packages');

// Tworzymy niezbędne foldery jeśli nie istnieją
if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
if (!fs.existsSync(ARCHIVAL_DIR)) fs.mkdirSync(ARCHIVAL_DIR, { recursive: true });

const files = fs.readdirSync(ROOT_DIR);
const zipFiles = files.filter(f => f.startsWith('PACZKA_') && f.endsWith('.zip'));

if (zipFiles.length === 0) {
  console.log('Nie znaleziono nowych paczek ZIP do przetworzenia.');
  process.exit(0);
}

console.log(`Znaleziono ${zipFiles.length} paczek do przetworzenia.`);

for (const zipFile of zipFiles) {
  const zipPath = path.join(ROOT_DIR, zipFile);
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
        // Bardzo prosta konwersja "DD.MM.YYYY" do ISO - zakładając format polski z HTML
        const parts = dateStr.split(',')[0].split('.');
        if (parts.length === 3) {
            // YYYY-MM-DD
            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
        }
    }

    // Jeśli kategoria jest przekazywana w nagłówku, bierzemy ją, w przeciwnym razie aktualności
    const categoryRaw = getMeta('KATEGORIA') || 'aktualności';
    // Kategoria jako bezpieczny string (lowercase z myślnikami, ułatwi to routing)
    const categorySlug = slugify(categoryRaw, { lower: true, strict: true });
    const categoryName = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);

    // Slug dla samego wpisu
    const slug = slugify(title, { lower: true, strict: true, locale: 'pl' });
    
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

console.log('Zakończono import paczek.');
