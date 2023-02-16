
import Papa from 'papaparse';


export function generateCsv(data) {

    const trafficFlows = data.verkehrsstroeme;
    const flattened = trafficFlows.flatMap(trafficFlow =>
        trafficFlow.data.map(d => ({
            verkehrsstrom: trafficFlow.verkehrsstrom,
            zufahrt: trafficFlow.zufahrt,
            spur: trafficFlow.spur,
            strom: trafficFlow.strom,
            kennung: trafficFlow.kennung,
            stromtyp: trafficFlow.stromtyp,
            formel: trafficFlow.formel,
            kommentar: trafficFlow.kommentar,
            intervall_nr: d.intervallNr,
            intervall_start: d.intervallStart,
            intervall_ende: d.intervallEnde,
            rad: d.rad,
            krad: d.krad,
            pkw: d.pkw,
            lfz: d.lfz,
            lkw: d.lkw,
            lz: d.lz,
            bus: d.bus
        }))
    );

    return Papa.unparse(flattened, { header: true });

}
