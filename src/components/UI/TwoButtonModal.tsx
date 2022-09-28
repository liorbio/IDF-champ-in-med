import ModalBackgroundClicksPrevention from './ModalBackgroundClicksPrevention';
import classes from './TwoButtonModal.module.css';

const TwoButtonModal = ({ prompt, textLeft, textRight, colorSide, color, activeSide, handleQuit, handleActive }: { prompt: string, textLeft: string, textRight: string, colorSide: "right" | "left", color: string, activeSide: "right" | "left", handleQuit: () => void, handleActive: () => void }) => {
    const coloredStyle = {
        backgroundColor: color,
        fontWeight: "bold",
        color: "white"
    };

    return (
        <>
            <ModalBackgroundClicksPrevention handler={handleQuit} top={0} />
            <div className={classes.modalWrapper}>
                <p style={{ marginLeft: "1rem", marginRight: "1rem", textAlign: "center" }}>{prompt}</p>
                <div className={classes.buttonWrapper}>
                    <div className={classes.rightButton} style={colorSide === 'right' ? coloredStyle : undefined} onClick={activeSide === 'right' ? handleActive : handleQuit}><p>{textRight}</p></div>
                    <div className={classes.leftButton} style={colorSide === 'left' ? coloredStyle: undefined} onClick={activeSide === 'left' ? handleActive : handleQuit}><p>{textLeft}</p></div>
                </div>
            </div>
        </>
    )
};

export default TwoButtonModal;