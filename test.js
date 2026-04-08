import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

async function run() {
  const file = fs.readFileSync('public/uploads/MZW_STAN_20260119105708608 (1).pdf');
  const data = await pdfParse(file);
  console.log(data.text);
}
run().catch(console.error);
