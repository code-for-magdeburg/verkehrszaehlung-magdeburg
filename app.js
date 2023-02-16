
import * as fs from 'fs';
import { processDataFile } from './process-data-file.js';
import { generateCsv } from './generate-csv.js';


function saveAsJson(year, sourceFilename, data) {
    const targetDir = `./json/${year}`;
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const jsonFilePath = `${targetDir}/${sourceFilename}.json`;
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(jsonFilePath, jsonStr);
}


function saveAsCsv(year, sourceFilename, data) {
    const targetDir = `./csv/${year}`;
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const csvFilePath = `${targetDir}/${sourceFilename}.csv`;
    const csvStr = generateCsv(data);
    fs.writeFileSync(csvFilePath, csvStr, 'utf-8');
}


async function processAllFiles() {

    const years = fs
        .readdirSync('./pdf')
        .filter(dir => dir.match(/20\d{2}/));

    for (const year of years) {

        const files = fs.readdirSync(`./pdf/${year}`).filter(file => file.toLowerCase().endsWith('.pdf'));
        for (const file of files) {
            const pdfFilePath = `./pdf/${year}/${file}`;
            console.log(`Parsing ${pdfFilePath}`);
            const data = await processDataFile(pdfFilePath);
            saveAsJson(year, file, data);
            saveAsCsv(year, file, data);
        }

    }

}

processAllFiles()
    .then(_ => console.log('Done.'))
    .catch(console.error);
