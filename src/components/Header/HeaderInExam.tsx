import { useEffect, useState, useCallback } from "react";
import ReactDOM from 'react-dom';
import classes from './Header.module.css';
import { NavigateFunction } from "react-router-dom";
import { portalElement } from "../../elements/portalElement";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RawAnswer } from "../../store/deviceScoresSlice";
import { cloudActions, currentActions, deviceScoresActions, scoreBoardActions } from "../../store/redux-logic";
import NavigatorIcon from "../UI/NavigatorIcon";
import TwoButtonModal from "../UI/TwoButtonModal";
import ExamStrip from "./ExamStrip";
import CodeModalOneInput from "../UI/CodeModalOneInput";

const HeaderInExam = ({ house, unit, player, navigate }: { house: string, unit: string, player: string, navigate: NavigateFunction }) => {
    const dispatch = useAppDispatch();
    const currentQuestion = useAppSelector(state => state.current.currentQuestion);
    const currentDevice = useAppSelector(state => state.current.currentDevice);
    const numberOfQuestionsInCurrentModule = useAppSelector(state => state.current.numberOfQuestionsInCurrentModule);
    const timerRunning = useAppSelector(state => state.current.timerRunning);
    const timeLeftForBackup = useAppSelector(state => state.current.timeLeftForBackup);
    const modules = useAppSelector(state => state.current.modulesAnswers);
    const phoneName = useAppSelector(state => state.cloud.phoneName);
    const [questionsSolved, setQuestionsSolved] = useState<number[]>([]);
    const [showExitWithSaveModal, setShowExitWithSaveModal] = useState(false);
    const [showCodeModalForSave, setShowCodeModalForSave] = useState(false);
    const [showExitWithoutSavingModal, setShowExitWithoutSavingModal] = useState(false);
    const [showCodeModalForNoSave, setShowCodeModalForNoSave] = useState(false);

    useEffect(() => {
        if (currentDevice) {
            const questionsSolvedToPush: number[] = [];
            const answersSoFar = modules.find(m => m.device === currentDevice)!.answers.map(a => a.number);
            questionsSolvedToPush.push(...answersSoFar);
            setQuestionsSolved(questionsSolvedToPush);
        }
    }, [modules, currentDevice]);
    const hideModals = () => {
        setShowExitWithSaveModal(false);
        setShowCodeModalForSave(false);
        setShowExitWithoutSavingModal(false);
        setShowCodeModalForNoSave(false);
    };
    const pressNext = () => {
        if (currentQuestion === numberOfQuestionsInCurrentModule) {
            if (modules[0].answers.length === 0) {
                setShowExitWithoutSavingModal(true);
            } else {
                setShowExitWithSaveModal(true);
            }
        } else {
            dispatch(currentActions.nextQuestion());
        }
    };
    const pressPrev = () => {
        if (currentQuestion === 1) {
            if (modules[0].answers.length === 0) {
                setShowExitWithoutSavingModal(true);
            } else {
                setShowExitWithSaveModal(true);
            }
        } else {
            dispatch(currentActions.prevQuestion());
        }
    };

    // Timer ⬇️
    const [timeLeft, setTimeLeft] = useState(300000);
    // set up different start time in Backup Mode:
    useEffect(() => {
        if (timeLeftForBackup !== 300000) {
            setTimeLeft(timeLeftForBackup);
        }
    }, [timeLeftForBackup]);

    const saveAnswers = useCallback(() => {
        modules.forEach(m => {
            dispatch(scoreBoardActions.addPlayerScoresForModule({
                house: house,
                unit: unit,
                device: m.device,
                player: player,
                scores: m.scores
            }));
            const rawAnswers: RawAnswer[] = m.answers.map(r => { return { number: r.number, kind: r.kind, answer: r.answer } });
            dispatch(deviceScoresActions.addDeviceScorePerPlayer({
                deviceName: m.device,
                house: house,
                unit: unit,
                player: player,
                playerScores: m.scores,
                playerAnswers: rawAnswers,
                uploadedFrom: phoneName,
                testDate: new Date().getTime()
            }));
        });
    }, [dispatch, house, modules, unit, phoneName, player]);

    const exitExamAndSave = useCallback(() => {
        dispatch(currentActions.setTimerOff());
        saveAnswers();
        dispatch(currentActions.setCurrentDevice(""));
        dispatch(currentActions.setCurrentQuestion(1));      
        dispatch(currentActions.changeTimeLeftForBackup(300000));
        dispatch(cloudActions.markAnythingToUpload(true));
        setTimeLeft(300000);
        setQuestionsSolved([]);
    }, [dispatch, saveAnswers]);

    const exitExamWithoutSave = useCallback(() => {
        dispatch(currentActions.setTimerOff());
        dispatch(currentActions.setCurrentDevice(""));
        dispatch(currentActions.setCurrentQuestion(1));      
        dispatch(currentActions.changeTimeLeftForBackup(300000));
        setTimeLeft(300000);
        setQuestionsSolved([]);
    }, [dispatch]);

    const handleTimesUp = useCallback(() => {
        exitExamAndSave();
        navigate('/timesup');
    }, [exitExamAndSave, navigate]);
    useEffect(() => {
        if (timerRunning) {
            const newTimer = setInterval(() => { setTimeLeft(prev => {
                return prev - 1000;
            }); }, 1000);
            return () => {
                clearInterval(newTimer);
            }
        }
    }, [timerRunning]);
    useEffect(() => {
        if (timeLeft === 0) {
            handleTimesUp();
        }
    }, [timeLeft, handleTimesUp]);

    const handleExitWithoutSave = () => {
        hideModals();
        dispatch(currentActions.exitModulePrematurelyWithoutSaving());
        dispatch(deviceScoresActions.removeDeviceScoreUponConfusion({ house: house, unit: unit, player: player }));
        dispatch(scoreBoardActions.undoAddDeviceToUnit({ house: house, unit: unit, device: currentDevice }));
        exitExamWithoutSave();
    };
    const handleExitWithSave = () => {
        hideModals();
        dispatch(currentActions.exitModulePrematurelyAndSave());
        exitExamAndSave();
        navigate('/round-setup');
    }
    // Timer ⬆️
    if (currentDevice) {
        return (
            <div className={classes.headerWrapper}>
                <p  style={{ margin: 0, gridArea: "2 / 1", fontSize: "0.8rem", fontWeight: "bold"}}>{new Date(timeLeft).toISOString().slice(14,19)}</p>
                <h5 style={{ margin: 0, gridArea: "2 / 2", color: "#303030" }}>{currentDevice}</h5>
                <NavigatorIcon icon={currentQuestion === 1 ? "Xright" : ">"} handler={pressPrev} />
                <h3 style={{ margin: 0, gridArea: "3 / 2", color: "#303030" }}>{`שאלה ${currentQuestion}`}</h3>
                <NavigatorIcon icon={currentQuestion === numberOfQuestionsInCurrentModule ? "Xleft" : "<"} handler={pressNext} />
                <ExamStrip questionsSolved={questionsSolved} numberOfQuestions={numberOfQuestionsInCurrentModule} currentQuestion={currentQuestion} />
                {showExitWithSaveModal && ReactDOM.createPortal(<TwoButtonModal prompt="לצאת מהמבחן לפני סוף הזמן? התשובות ישמרו ולא ניתן יהיה לשנות אותן!" textLeft="לא" textRight="כן" colorSide="left" color="#B91118" activeSide="right" handleQuit={() => setShowExitWithSaveModal(false)} handleActive={() => setShowCodeModalForSave(true)} />, portalElement)}
                {showCodeModalForSave && ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד נציג הנדסה רפואית" requiredCodes={["1111","1234","2222"]} proceed={handleExitWithSave} goBack={hideModals} topForBackground={15} />, portalElement)}
                {showExitWithoutSavingModal && ReactDOM.createPortal(<TwoButtonModal prompt="לצאת מהמבחן? " textLeft="לא" textRight="כן" colorSide="left" color="#B91118" activeSide="right" handleQuit={() => setShowExitWithoutSavingModal(false)} handleActive={() => setShowCodeModalForNoSave(true)} />, portalElement)}
                {showCodeModalForNoSave && ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד נציג הנדסה רפואית" requiredCodes={["1111","1234","2222"]} proceed={handleExitWithoutSave} goBack={hideModals} topForBackground={15} />, portalElement)}
            </div>
        );
    } else {
        return (
            <div className={classes.headerWrapper}>
                <p  style={{ margin: 0, gridArea: "2 / 1", fontSize: "0.8rem", fontWeight: "bold"}}>{new Date(timeLeft).toISOString().slice(14,19)}</p>
                <NavigatorIcon icon=">" handler={() => navigate('/round-setup')} />
                <h2 style={{ margin: 0, gridArea: "3 / 2", color: "#303030" }}>{`${house} - ${unit}`}</h2>
                {/* Options -- necessary? */}
                <h4 style={{ margin: 0, gridArea: "4 / 2", color: "#303030", fontWeight: 500 }}>{`שחקן ${player}`}</h4>
            </div>
        );
    }
};

export default HeaderInExam;