import classes from './DeviceRow.module.css';

const PlayerColumn = ({ player, totalPoints, playerScore, totalScoreByPlayer, totalPossibleScore }: { player: string, totalPoints: number[], playerScore: number[], totalScoreByPlayer: number, totalPossibleScore: number }) => {
    
    return (
        <div className={classes.playerColumn} style={{ gridTemplateRows: `2rem${" 2rem".repeat(playerScore.length)}` }}>
            <p style={{ lineHeight: 2.8 }}>{`שחקן ${player}`}</p>
            {playerScore.map((s, idx) => <p key={idx}>{Math.round(s*100)/100}<span style={{ color: "#9C9C9C"}}>{`/${totalPoints[idx]}`}</span></p>)}
            {<p>{Math.round(totalScoreByPlayer*100)/100}<span style={{ color: "#bbb"}}>{`/${totalPossibleScore}`}</span></p>}
        </div>
    )
};

export default PlayerColumn;