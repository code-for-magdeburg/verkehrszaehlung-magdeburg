import { PdfReader } from 'pdfreader';


export async function extractText(filename) {

    return new Promise((resolve, reject) => {

        const textItems = [];
        let page = 0;

        new PdfReader().parseFileItems(filename, (err, item) => {
            if (err) {
                return reject(err);
            } else if (!item) {
                return resolve(textItems);
            } else if (item.page) {
                page = item.page;
            } else if (item.text) {
                textItems.push({ page, x: item.x, y: item.y, text: item.text.trim() })
            }
        });

    });

}
