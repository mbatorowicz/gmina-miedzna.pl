const fs = require('fs');
const pdfParse = require('pdf-parse');

const dataBuffer = fs.readFileSync('MZW_STAN_20260119105708608 (1).pdf');
pdfParse(dataBuffer).then(function(data) {
    console.log(data.text.substring(0, 1000));
}).catch(console.error);
