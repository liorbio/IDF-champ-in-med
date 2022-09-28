import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Home.module.css';
import CodeModalOneInput from '../../UI/CodeModalOneInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { authActions } from '../../../store/redux-logic';
import Warning from '../../UI/Warning';

const portalElementAsArray = document.querySelectorAll<HTMLElement>("#overlay-root");
const portalElement = portalElementAsArray[0];

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const devicesForHouses = useAppSelector(state => state.houses.houses);
    const showEnterRoundSetup = Object.keys(devicesForHouses).every(h => devicesForHouses[h].length > 0);
    const phoneName = useAppSelector(state => state.cloud.phoneName);
    const [showPhoneNameWarning, setShowPhoneNameWarning] = useState(false);

    useEffect(() => {
        dispatch(authActions.unauthorize());
    }, [dispatch]);

    const [codeModalShownForAddUnits, setCodeModalShownForAddUnits] = useState(false);
    const continueOntoAddUnits = () => {
        setCodeModalShownForAddUnits(false);
        dispatch(authActions.authorize("chief"));
        navigate('/add-units');
    };

    
    const [codeModalShownForSetupStation, setCodeModalShownForSetupStation] = useState(false);
    const continueOntoSetupStation = () => {
        setCodeModalShownForSetupStation(false);
        dispatch(authActions.authorize("boss"));
        navigate('/station-setup');
    };
    const handleSetupStationClick = () => {
        if (phoneName === "") {
            setShowPhoneNameWarning(true);
        } else {
            setCodeModalShownForSetupStation(true);
        }
    }
    const [codeModalShownForRoundSetup, setCodeModalShownForRoundSetup] = useState(false);
    const continueOntoRoundSetup = () => {
        setCodeModalShownForRoundSetup(false);
        dispatch(authActions.authorize("rep"));
        navigate('/round-setup');
    };
    const [codeModalShownForLeaderboard, setCodeModalShownForLeaderboard] = useState(false);
    const continueOntoLeaderboard = () => {
        setCodeModalShownForLeaderboard(false);
        dispatch(authActions.authorize("chief"));
        navigate('/leaderboard');
    }
    const [codeModalShownForCloudStatus, setCodeModalShownForCloudStatus] = useState(false);
    const continueOntoCloudStatus = () => {
        setCodeModalShownForCloudStatus(false);
        dispatch(authActions.authorize("boss"));
        navigate('/cloud-status');
    }
    const exitCodeModal = () => {
        setCodeModalShownForSetupStation(false);
        setCodeModalShownForLeaderboard(false);
        setCodeModalShownForAddUnits(false);
        setCodeModalShownForCloudStatus(false);
        setCodeModalShownForRoundSetup(false);
    }

    return (
        <div className={classes.homeWrapper}>
            <h1>אליפות צה"ל ברפואה</h1>
            <div className={classes.button} onClick={() => setCodeModalShownForAddUnits(true)}><span>הזנת שמות היחידות</span></div>
            {codeModalShownForAddUnits && ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד מפקד תחנה" requiredCodes={["1111"]} proceed={continueOntoAddUnits} goBack={exitCodeModal} topForBackground={0} />, portalElement)}
            
            <div className={classes.button} onClick={handleSetupStationClick}><span>הגדרת מכשירים עבור תחנה</span></div>
            {showPhoneNameWarning && <Warning text="יש להזין שם טלפון לפני הגדרת תחנה!" handleClose={() => setShowPhoneNameWarning(false)} />}
            {codeModalShownForSetupStation && ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד מפקד כיתה" requiredCodes={["1111", "1234"]} proceed={continueOntoSetupStation} goBack={exitCodeModal} topForBackground={0} />, portalElement)}
            
            {showEnterRoundSetup && <div className={classes.button} onClick={() => setCodeModalShownForRoundSetup(true)}><span>חזרה להכנת סיבוב</span></div>}
            {codeModalShownForRoundSetup &&  ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד נציג הנדסה רפואית" requiredCodes={["1111", "1234", "2222"]} proceed={continueOntoRoundSetup} goBack={exitCodeModal} topForBackground={0} />, portalElement)}
            
            <div className={classes.button} onClick={() => setCodeModalShownForLeaderboard(true)}><span>טבלת ניקוד</span></div>
            {codeModalShownForLeaderboard && ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד מפקד תחנה" requiredCodes={["1111"]} proceed={continueOntoLeaderboard} goBack={exitCodeModal} topForBackground={0} />, portalElement)}
            
            <div className={classes.button} onClick={() => setCodeModalShownForCloudStatus(true)}><span>קבלת נתונים מהענן</span></div>
            {codeModalShownForCloudStatus && ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד מפקד כיתה" requiredCodes={["1111", "1234"]} proceed={continueOntoCloudStatus} goBack={exitCodeModal} topForBackground={0} />, portalElement)}
        </div>
    );
};

export default Home;