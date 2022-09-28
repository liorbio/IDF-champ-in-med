import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { cloudActions } from "../../../store/redux-logic";
import classes from './CloudStatus.module.css';

const getElapsedTime = (timeNow: number, pastTime: number) => {
    const diff = (timeNow - pastTime)/1000;
    if (diff >= 60) {
        return `הועלה לפני ${Math.round(diff/60)} דקות`;
    } else {
        return `הועלה לפני ${Math.round(diff)} שניות`;
    }
}
const redIfLongTimePassed = (timeNow: number, pastTime: number) => {
    const diff = (timeNow - pastTime)/1000;
    if (diff >= 20*60) {
        return true;
    } else {
        return false;
    }
}

const CloudStatus = () => {
    const [showInput, setShowInput] = useState(false);
    const phoneName = useAppSelector(state => state.cloud.phoneName);
    const phoneList = useAppSelector(state => state.cloud.phoneList);
    const dispatch = useAppDispatch();
    const setPhoneName = (event: React.FocusEvent<HTMLInputElement>) => {
        dispatch(cloudActions.changePhoneName(event.currentTarget.value));
        setShowInput(false);
    }
    const [timeNow, setTimeNow] = useState(new Date().getTime());
    useEffect(() => {
        const oneMinInterval = setInterval(() => {
            setTimeNow(new Date().getTime());
        }, 60000);
        return () => {
            clearInterval(oneMinInterval);
        }
    }, []);

    return (
        <>
            <div className={classes.topWrapper}>
                {!showInput && <h2 onClick={() => setShowInput(true)}>{phoneName !== "" ? phoneName : "לחץ להזנת שם טלפון ייחודי"}</h2>}
                {showInput && <input type="text" onBlur={setPhoneName} placeholder="הזן שם ייחודי לטלפון" style={{ alignSelf: "center", height: "55%", borderRadius: "10px", fontSize: "1.5rem", fontFamily: "Assistant" }} />}
            </div>
            <div className={classes.listWrapper}>
                {phoneList.map((phone, idx) => <div key={idx} className={classes.phoneRow}><span style={{ color: redIfLongTimePassed(timeNow, phone.lastUploadDate) ? "#d30000": "#000" }}>{phone.phoneName}</span><span style={{ fontStyle: "italic", color: redIfLongTimePassed(timeNow, phone.lastUploadDate) ? "#d30000" : "#777" }}>{getElapsedTime(timeNow, phone.lastUploadDate)}</span></div>)}
            </div>
        </>
    );
};

export default CloudStatus;