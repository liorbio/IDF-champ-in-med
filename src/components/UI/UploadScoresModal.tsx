import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import classes from './UploadScoresModal.module.css';
import _ from 'lodash';
import React, { useState } from 'react';
import Warning from './Warning';
import { DeviceScore } from '../../store/deviceScoresSlice';
import { cloudActions, deviceScoresActions } from '../../store/redux-logic';

const UploadScoresModal = () => {
    const dispatch = useAppDispatch();
    const deviceScores = useAppSelector(state => state.deviceScores);
    const phoneName = useAppSelector(state => state.cloud.phoneName);
    const reversedDeviceScores = _.reverse([...deviceScores]);
    const isThereAnythingToUpload = useAppSelector(state => state.cloud.isThereAnythingToUpload);
    const [showUploadWarning, setShowUploadWarning] = useState(false);

    const postToAPI = async (dataToUpload: DeviceScore[]) => {
        const response = await fetch('/', { mode: 'cors', method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataToUpload, phoneName: phoneName }) });
        return response;
    }

    const handleUploadAll = () => {
        if (phoneName !== "") {
            try {
                const deviceScoresToUpload = deviceScores.filter(d => d.uploaded === "no" || d.uploaded === "partially");
                postToAPI(deviceScoresToUpload)
                .then((resp) => {
                    console.log(`Response is: ${resp}`);
                    dispatch(deviceScoresActions.markAllAsUploaded());
                    dispatch(cloudActions.markAnythingToUpload(false));
                })
                .catch((err) => { setShowUploadWarning(true); console.log(`postToAPI error: ${err}`)});
            } catch (error) {
                setShowUploadWarning(true);
            }
        }
    };

    return (
        <>
            <div className={classes.modal}>
                <div className={classes.topWrapper}>
                    {!isThereAnythingToUpload ? <h1 style={{ color: "green" }}>&#x2714;&#xFE0E;</h1>: <h1 onClick={handleUploadAll}>&#x27F3;&#xFE0E;</h1>}
                    <h2>נתונים במכשיר זה</h2>
                </div>
                <div className={classes.bodyWrapper}>
                    {deviceScores.length > 0 ? reversedDeviceScores.map(s => {
                        return (
                            <div className={classes.unitWrapper} key={s.testDate+s.unit}>
                                {s.uploaded === "fully" && <span style={{ color: "green", fontWeight: 600, lineHeight: 2.8 }}>&#x2714;&#xFE0E;</span>}
                                {s.uploaded === "partially" && <span style={{ color: "#d3c128", fontWeight: 600, lineHeight: 2.8 }}>&#x2714;&#xFE0E;</span>}
                                {s.uploaded === "no" && <span style={{ fontWeight: 600, lineHeight: 2.8 }}>&#x27F3;&#xFE0E;</span>}
                                <h4>{s.unit}</h4>
                                <p style={{ fontWeight: "normal" }}>{s.deviceName}</p>
                            </div>
                        );
                    })
                    :
                        <h3 style={{ color: "#ccc", fontWeight: "normal", marginTop: "0.8rem" }}>אין נתונים במכשיר זה...</h3>
                    }
                </div>
            </div>
            {showUploadWarning && <Warning text="העלאה כשלה!" handleClose={() => setShowUploadWarning(false)} />}
        </>
    );
};

export default UploadScoresModal;