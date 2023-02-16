
export function buildTextRows(textItems) {

    return textItems
        .sort((a, b) => {
            if (a.page === b.page) {
                return a.y === b.y ? a.x - b.x : a.y - b.y;
            }
            return a.page - b.page;
        })
        .reduce((result, current) => {
            const pageStr = (`${current.page}`).padStart(3, '0');
            const yPositionStr = (`${Math.floor(current.y * 1000)}`).padStart(6, '0');
            const key = `${pageStr}-${yPositionStr}`;
            const rowItem = (result[key] = result[key] || { page: current.page, y: current.y, textItems: [] });
            rowItem.textItems.push(current.text);
            return result;
        }, {});

}
