import { useRef } from 'react';
import ModalBackgroundClicksPrevention from './ModalBackgroundClicksPrevention';
import classes from './TwoButtonModal.module.css';

const BackupModal = ({ numberOfQuestions, textLeft, textRight, colorSide, color, activeSide, handleQuit, startWithPresetValues }: { numberOfQuestions: number, textLeft: string, textRight: string, colorSide: "right" | "left", color: string, activeSide: "right" | "left", handleQuit: () => void, startWithPresetValues: (timeLeft: number, question: number) => void }) => {
    const timeRef = useRef<HTMLInputElement>(null);
    const questionRef = useRef<HTMLSelectElement>(null);
    
    const coloredStyle = {
        backgroundColor: color,
        fontWeight: "bold",
        color: "black"
    };

    const handleSubmitModal = () => {
        if (timeRef.current && questionRef.current?.value) {
            const mins = parseInt(timeRef.current.value[4]);
            const secs = parseInt(timeRef.current.value.substring(6,8));
            const tim = mins*60000 + secs*1000;
            if (tim < 300000) {
                startWithPresetValues(tim, parseInt(questionRef.current?.value));
            }
        }
        
    }

    return (
        <>
            <ModalBackgroundClicksPrevention handler={handleQuit} top={0} />
            <div className={classes.modalWrapper} style={{ height: "35vh", justifyContent: "space-between" }}>
                <p style={{ marginLeft: "1rem", marginRight: "1rem", textAlign: "center" }}>כמה זמן נותר לשחקן?</p>
                <input ref={timeRef} style={{ height: "2rem" }} type="time" step='1' min='00:00:00' max='00:05:00' defaultValue='00:05:00' />
                <p style={{ marginLeft: "1rem", marginRight: "1rem", textAlign: "center" }}>להתחיל משאלה מספר</p>
                <select ref={questionRef} style={{ width: "24vw", height: "2rem" }}>
                    {Array.from({length: numberOfQuestions-1}, (x, idx) => idx+1).map(num => <option key={num} value={num}>{num}</option>)}
                </select>
                <div className={classes.buttonWrapper}>
                    <div className={classes.rightButton} style={colorSide === 'right' ? coloredStyle : undefined} onClick={activeSide === 'right' ? handleSubmitModal : handleQuit}><p>{textRight}</p></div>
                    <div className={classes.leftButton} style={colorSide === 'left' ? coloredStyle: undefined} onClick={activeSide === 'left' ? handleSubmitModal : handleQuit}><p>{textLeft}</p></div>
                </div>
            </div>
        </>
    )
};

export default BackupModal;