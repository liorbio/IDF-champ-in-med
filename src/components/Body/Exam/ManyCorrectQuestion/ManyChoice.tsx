import classes from './ManyChoice.module.css';

const ManyChoice = ({ text, chosen, handleChoose, itemNumber }: { text: string, chosen: boolean, handleChoose: (num: number) => void, itemNumber: number }) => {
    
    const handleClick = () => {
        handleChoose(itemNumber);
    };

    return (
        <div className={classes.listItem} onClick={handleClick}>
            <div className={classes.checkmarkSquare} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {chosen && <span style={{ color: "green", fontWeight: 600 }}>&#x2714;&#xFE0E;</span>}
            </div>
            <div className={classes.choice}>{text}</div>
        </div>
    );
};

export default ManyChoice;