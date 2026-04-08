import fs from 'fs';
import pdfParse from 'pdf-parse';

async function extract() {
  const filePath = 'MZW_STAN_20260119105708608 (1).pdf';
  const dataBuffer = fs.readFileSync(filePath);
  
  try {
    const data = await pdfParse(dataBuffer);
    console.log("=============== PDF TEXT EXTRACT ===============");
    console.log(data.text.substring(0, 1500));
    console.log("================================================");
  } catch (error) {
    console.error("Błąd parsowania:", error);
  }
}

extract();
