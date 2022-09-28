import { useState } from "react";
import DeviceRow from "./DeviceRow";
import classes from './UnitRow.module.css';
//                         player/totals
type ScoresObject = Record<string, { cloudStatus: "local" | "imported" | "uploaded", scores: number[] }>;
type Device = Record<string, ScoresObject>;
//                                          device                       player/totals
type totalsAndPercentageForDevice = Record<string, { totalScores: Record<string, number>, percentage: number }>;

const UnitRow = ({ unitName, unitDevices }: { unitName: string, unitDevices: Device }) => {
    // perhaps use React.Memo on this RFC
    const [show, setShow] = useState(false); 
    const totalsAndPercentage: totalsAndPercentageForDevice = {};
    // calculate percentages from each device
    for (const device in unitDevices) {
        totalsAndPercentage[device] = { totalScores: {}, percentage: 0 };
        for (const player in unitDevices[device]) {
            totalsAndPercentage[device].totalScores[player] = unitDevices[device][player].scores.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
        }
        const percentageForDevice = Object.keys(totalsAndPercentage[device].totalScores).filter(x => x !== 'totals').reduce((previousValue, currentValue) => previousValue + (100*totalsAndPercentage[device].totalScores[currentValue]/(totalsAndPercentage[device].totalScores.totals*3)), 0);
        totalsAndPercentage[device].percentage = percentageForDevice;
    }
    const averagePercentage = Object.values(totalsAndPercentage).reduce((previousValue, currentValue) => previousValue + (currentValue.percentage/Object.values(totalsAndPercentage).length), 0);
    const orderInFlexbox = 1000 - (Math.round(averagePercentage * 10));
    

    return (
        <div style={{ order: orderInFlexbox }}>
            <div className={classes.unitRow} onClick={() => setShow(prev => !prev)}>
                <h1 style={{ marginRight: "0.3rem", lineHeight: 2.3 }}>{averagePercentage.toFixed(1)}%</h1>
                <h2 style={{ lineHeight: 3.2 }}>{unitName}</h2>
                {show ? <h1 style={{ lineHeight: 2.3, color: "#9C9C9C", margin: 0 }}>&#x25BC;&#xFE0E;</h1> : <h1 style={{ lineHeight: 2.3, color: "#9C9C9C", margin: 0 }}>&#x25C0;&#xFE0E;</h1>}
            </div>
            {show && Object.keys(unitDevices).map(d => <DeviceRow key={d+unitName} deviceName={d} scoresObj={unitDevices[d]} totalScores={totalsAndPercentage[d].totalScores} percentage={totalsAndPercentage[d].percentage} />)}
        </div>
    )
};

export default UnitRow;