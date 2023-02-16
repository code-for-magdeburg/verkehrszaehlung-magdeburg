import { extractText } from './extract-text.js';
import { buildTextRows } from './build-text-rows.js';
import { extractMainInfo } from './extract-main-info.js';
import { extractTrafficFlowData } from './extract-traffic-flow-data.js';


export async function processDataFile(filename) {

    return new Promise((resolve, reject) => {

        extractText(filename)
            .then(textItems => {
                const textRows = buildTextRows(textItems);
                const mainInfo = extractMainInfo(textRows);
                const trafficFlows = extractTrafficFlowData(textRows);
                resolve({ meta: mainInfo, verkehrsstroeme: trafficFlows });
            })
            .catch(reject);

    });

}


//module.exports = processDataFile;
