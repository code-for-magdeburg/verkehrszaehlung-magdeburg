
export function extractTrafficFlowData(textRows) {

    const trafficFlows = [];

    let cmd = 'seek-traffic-flow-header';
    let trafficFlow = null;
    let trafficFlowAdditionalInfo = null;
    let dataColumns = [];
    let trafficFlowData = [];
    Object
        .values(textRows)
        .forEach(textRow => {
            switch (cmd) {

                case 'seek-traffic-flow-header':
                    const headerRowStr = textRow.textItems.join('');
                    if (headerRowStr.startsWith('Verkehrsstrom:')) {
                        trafficFlow = parseTrafficFlowHeader(headerRowStr);
                        if (trafficFlows.every(tf => tf.verkehrsstrom !== trafficFlow.verkehrsstrom)) {
                            cmd = 'seek-traffic-flow-subheader';
                        }
                    }
                    break;

                case 'seek-traffic-flow-subheader':
                    const subheaderRowStr = textRow.textItems.join('');
                    if (subheaderRowStr.startsWith('Formel:')) {
                        trafficFlowAdditionalInfo = parseTrafficFlowSubheader(subheaderRowStr);
                        trafficFlowData = [];
                        cmd = 'seek-table-header';
                    } else if (textRow.textItems.length > 0 && textRow.textItems[0] === 'Zeitintervall') {
                        trafficFlowAdditionalInfo = createEmptyTrafficFlowAdditionalInfo();
                        dataColumns = textRow.textItems.map(item => item.toLowerCase());
                        trafficFlowData = [];
                        cmd = 'collect-traffic-flow-data';
                    }
                    break;

                case 'seek-table-header':
                    if (textRow.textItems.length > 0 && textRow.textItems[0] === 'Zeitintervall') {
                        dataColumns = textRow.textItems.map(item => item.toLowerCase());
                        trafficFlowData = [];
                        cmd = 'collect-traffic-flow-data';
                    }
                    break;

                case 'collect-traffic-flow-data':
                    const rowStr = textRow.textItems.join('');
                    if (rowStr.startsWith('Gesamt')) {
                        trafficFlows.push({
                            ...trafficFlow,
                            ...trafficFlowAdditionalInfo,
                            data: trafficFlowData
                        });
                        cmd = 'seek-traffic-flow-header';
                    } else {
                        const parsedDataRow = parseDataRow(textRow, dataColumns);
                        if (parsedDataRow) {
                            trafficFlowData.push(parsedDataRow);
                        }
                    }
                    break;

            }
        });

    return trafficFlows;

}


function parseTrafficFlowHeader(headerRowStr) {
    const regex = /Verkehrsstrom:\s*(?<verkehrsstrom>.*)\s*Zufahrt:\s*(?<zufahrt>.*)\s*Spur:\s*(?<spur>.*)\s*Strom:\s*(?<strom>.*)\s*Kennung:\s*(?<kennung>.*)\s*Stromtyp:\s*(?<stromtyp>.*)\s*/
    const found = headerRowStr.match(regex);
    return found?.groups;
}


function parseTrafficFlowSubheader(subheaderRowStr) {
    const regex = /Formel:\s*(?<formel>.*)\s*Kommentar:\s*(?<kommentar>.*)\s*/
    const found = subheaderRowStr.match(regex);
    return found?.groups;
}


function createEmptyTrafficFlowAdditionalInfo() {
    return { formel: null, kommentar: null };
}


function parseDataRow(textRow, dataColumns) {

    if (textRow.textItems.length > 0) {

        const zeitintervall = textRow.textItems[0].match(/^(?<intervallNr>0[0-9]{2})\s(?<intervallStart>[0-9]{2}:[0-9]{2})\s-\s(?<intervallEnde>[0-9]{2}:[0-9]{2})$/);
        if (zeitintervall) {
            return {
                ...zeitintervall.groups,
                rad: textRow.textItems[dataColumns.indexOf('rad')] || null,
                krad: textRow.textItems[dataColumns.indexOf('krad')] || null,
                pkw: textRow.textItems[dataColumns.indexOf('pkw')] || null,
                lfz: textRow.textItems[dataColumns.indexOf('lfz')] || null,
                lkw: textRow.textItems[dataColumns.indexOf('lkw')] || null,
                lz: textRow.textItems[dataColumns.indexOf('lz')] || null,
                bus: textRow.textItems[dataColumns.indexOf('bus')] || null
            };
        }

    }

    return null;

}
