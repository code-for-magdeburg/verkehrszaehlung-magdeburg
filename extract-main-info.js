
export function extractMainInfo(textRows) {

    let cmd = 'seek-first-main-header-row';
    let firstMainHeaderRow = null;
    let thirdMainHeaderRow = null;
    Object
        .values(textRows)
        .every(textRow => {
            switch (cmd) {
                case 'seek-first-main-header-row':
                    if (textRow.textItems.length > 0 && textRow.textItems[0].startsWith('Kurzbezeichnung:')) {
                        firstMainHeaderRow = parseFirstMainHeaderRow(textRow);
                        cmd = 'seek-third-main-header-row';
                    }
                    return true;
                case 'seek-third-main-header-row':
                    if (textRow.textItems.length > 0 && textRow.textItems[0].startsWith('Zählzeit:')) {
                        thirdMainHeaderRow = parseThirdMainHeaderRow(textRow);
                        return false;
                    }
                    return true;
                default:return true;
            }
        });

    return { ...firstMainHeaderRow, ...thirdMainHeaderRow };

}


function parseFirstMainHeaderRow(textRow) {
    return {
        kurzbezeichnung: textRow.textItems[0].substr('Kurzbezeichnung: '.length),
        ort: textRow.textItems.slice(1, textRow.textItems.length - 1).join(' ')
    };
}


function parseThirdMainHeaderRow(textRow) {
    const timeTextItem = textRow.textItems[0] || '';
    const dateTextItem = (textRow.textItems[1] || '').substr('Zähldatum: '.length, 10);
    const intervalTextItem = textRow.textItems[2] || '';
    const time = timeTextItem.substr('Zählzeit: '.length, 11);
    const date = dateTextItem.match(/^(?<day>\d{2}).(?<month>\d{2}).(?<year>\d*)$/).groups;
    return {
        zaehlzeitStart: time.match(/^\d{2}:\d{2}/)[0],
        zaehlzeitEnde: time.match(/\d{2}:\d{2}$/)[0],
        zaehldatum: `${date.year}-${date.month}-${date.day}`,
        zaehlintervall: intervalTextItem.substr('Zählintervall: '.length)
    };
}
