import { CSSProperties, useState } from "react";
import PlayerColumn from "./PlayerColumn";
import classes from './DeviceRow.module.css';

type ScoresObject = Record<string, { cloudStatus: "local" | "imported" | "uploaded", scores: number[] }>;

const DeviceRow = ({ deviceName, scoresObj, totalScores, percentage }: { deviceName: string, scoresObj: ScoresObject, totalScores: Record<string, number>, percentage: number }) => {
    const headerColor: CSSProperties = { backgroundColor: scoresObj.totals.cloudStatus === "local" ? "#F5DCDE" : "#d6e2e6" };
    const sectionColor: CSSProperties = { backgroundColor: scoresObj.totals.cloudStatus === "local" ? "#FBEDED" : "#ecf3f7" };
    
    const [show, setShow] = useState(false);
    const qNumbers = Array.from({length: scoresObj.totals.scores.length}, (x, idx) => `ש${idx+1}`);
    const qNumbersWithIndent = [".", ...qNumbers, 'סה"כ'];
    
    const sums = { total: 0, ofPlayers: 0 };
    sums.total = totalScores.totals * 3; // (Object.keys(totalScores).length - 1);
    sums.ofPlayers = Object.keys(totalScores).filter(x => x !== 'totals').reduce((previousValue, currentValue) => previousValue + totalScores[currentValue], 0);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div onClick={() => setShow(prev => !prev)} className={classes.deviceHeader} style={headerColor}>
                <h1 style={{ lineHeight: 1.7 }}>{percentage.toFixed(1)}%</h1>
                <h3 style={{ lineHeight: 2.9 }}>{deviceName}</h3>
                {show ? <h2 style={{ lineHeight: 2.3, color: "#9C9C9C" }}>&#x25BC;&#xFE0E;</h2> : <h2 style={{ lineHeight: 2.3, color: "#9C9C9C" }}>&#x25C0;&#xFE0E;</h2>}
            </div>
            {show && <div className={classes.scoreSection} style={{ ...sectionColor, gridTemplateColumns: Object.keys(scoresObj).length === 5 ? "3rem 1fr 1fr 1fr 1fr" : "3rem 1fr 1fr 1fr" }}>
                <div style={{ gridTemplateRows: `2rem${" 2rem".repeat(qNumbers.length)}` }} className={classes.playerColumn}>{
                    qNumbersWithIndent.map((q, idx) => <p key={q} style={{ color: idx === 0 ? "#ffffff00" : "#000" }}>{q}</p>)
                }</div>
                {Object.keys(scoresObj).map(x => x !== 'totals' && <PlayerColumn key={x+new Date().toISOString} player={x} totalPoints={scoresObj.totals.scores} playerScore={scoresObj[x].scores} totalScoreByPlayer={totalScores[x]} totalPossibleScore={totalScores.totals} />)}
            </div>}
            {show && <div style={sectionColor} className={classes.lastRow}>באחוזים: {percentage.toFixed(1)}% = {Math.round(sums.ofPlayers*100)/100}<span style={{ color: "#9C9C9C"}}>/{sums.total}</span></div>}
        </div>
    );
};

export default DeviceRow;