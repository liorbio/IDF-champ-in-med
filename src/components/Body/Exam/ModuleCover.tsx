import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { currentActions } from '../../../store/redux-logic';
import BackupModal from '../../UI/BackupModal';
import TwoButtonModal from '../../UI/TwoButtonModal';

import classes from './ModuleCover.module.css';

const portalElementAsArray = document.querySelectorAll<HTMLElement>("#overlay-root");
const portalElement = portalElementAsArray[0];

const ModuleCover = ({ device, numberOfQuestions, handleEnterModule }: { device: string, numberOfQuestions: number,  handleEnterModule: (device: string) => void }) => {
    const [modalShown, setModalShown] = useState(false);
    const [backupModalShown, setBackupModalShown] = useState(false);
    const timerRunning = useAppSelector(state => state.current.timerRunning);
    const player = useAppSelector(state => state.current.player);
    const dispatch = useAppDispatch();

    const handleClick = () => {
        if (!timerRunning) {
            if (player.includes('גיבוי')) {
                setBackupModalShown(true);
            } else {
                setModalShown(true);
            }
        } else {
            handleEnterModule(device);
        }
    };
    const handleQuit = () => {
        setModalShown(false);
        setBackupModalShown(false);
    }
    const handleStartRound = () => {
        handleEnterModule(device);
        setModalShown(false);
    }
    const startWithPresetValues = (timeLeft: number, question: number) => {
        dispatch(currentActions.setCurrentQuestion(question));
        dispatch(currentActions.changeTimeLeftForBackup(timeLeft));
        setBackupModalShown(false);
        setModalShown(true);
    };
    
    return (
        <>
            {backupModalShown && ReactDOM.createPortal(<BackupModal numberOfQuestions={numberOfQuestions} textLeft='ביטול' textRight='המשך' colorSide='right' activeSide='right' color='#92CBFF' handleQuit={handleQuit} startWithPresetValues={startWithPresetValues} />, portalElement)}
            {modalShown && ReactDOM.createPortal(<TwoButtonModal prompt="להתחיל סיבוב?" textLeft="לא" textRight="התחל!" colorSide='right' color="#B91118" activeSide="right" handleQuit={handleQuit} handleActive={handleStartRound}/>, portalElement)}
            <div className={classes.cover} onClick={handleClick}>
                {device}
            </div>
        </>
        
    )
};

export default ModuleCover;