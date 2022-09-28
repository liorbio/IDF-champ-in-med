import ReactDOM from 'react-dom';
import React, { useMemo, useState } from 'react';
import { QuestionRfc } from "../../../../types/rfc-types";
import { DragQuestionData } from '../../../../types/question-types';
import classes from './DragQuestion.module.css';
import Sticker from "./Sticker";
import _ from 'lodash';
import UIButton from '../../../UI/UIButton';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import ModalBackgroundClicksPrevention from '../../../UI/ModalBackgroundClicksPrevention';
import TwoButtonModal from '../../../UI/TwoButtonModal';
import { currentActions } from '../../../../store/redux-logic';
import { portalElement } from '../../../../elements/portalElement';


// Here we get the top/left dimensions of the grid cells (not the sticker, but the whole grid cell)
const vw = document.documentElement.clientWidth;
const vh = document.documentElement.clientHeight;

export const blanksCoords = [
    { left: 0.5*vw, right: vw, top: 0.48833*vh, bottom: 0.565*vh },
    { left: 0, right: 0.5*vw, top: 0.48833*vh, bottom: 0.565*vh },
    { left: 0.5*vw, right: vw, top: 0.565*vh, bottom: 0.64166*vh },
    { left: 0, right: 0.5*vw, top: 0.565*vh, bottom: 0.64166*vh },
    { left: 0.5*vw, right: vw, top: 0.64166*vh, bottom: 0.7183*vh },
    { left: 0, right: 0.5*vw, top: 0.64166*vh, bottom: 0.7183*vh }
];

const gridAreas = [
    "1 / 1",
    "1 / 2",
    "2 / 1",
    "2 / 2",
    "3 / 1",
    "3 / 2"
];

const DragQuestion: QuestionRfc<DragQuestionData> = ({ data }) => {
    const initialBlanksStatusArray = Array.from({length: data.stickers.length}, () => 0); // create array of [0, 0, ...] 0: blank empty, 1: blank wrong, 2: blank correct
    const [blanksStatus, setBlanksStatus] = useState(initialBlanksStatusArray);
    const [blanksValues, setBlanksValues] = useState(initialBlanksStatusArray);
    const shuffledStickers = useMemo(() => _.shuffle(data.stickers), [data.stickers]); // to keep shuffle order the same and not change upon every re-render

    // blanksStatus: [0, 1, 1, 2, 0]      0=empty, 1=wrong, 2=correct
    // stickerPlaces: [0, 2, 5, 0, 3]     0=inBank, 1=onBlank1, 2=onBlank2, ... 6=onBlank6
    const [stickerPlaces, setStickerPlaces] = useState(initialBlanksStatusArray); // same shape as blanks status array
    const updateStickerPlace = (stickerId: number, newPlace: number) => {
        setStickerPlaces(prev => {
            const newArr = [...prev];
            newArr[stickerId] = newPlace;
            return newArr;
        });
    };

    const currentQuestion = useAppSelector(state => state.current.currentQuestion);
    const currentDevice = useAppSelector(state => state.current.currentDevice);
    const numberOfQuestionsInCurrentModule = useAppSelector(state => state.current.numberOfQuestionsInCurrentModule);
    const dispatch = useAppDispatch();
    const show = data.questionNumber === currentQuestion && data.device === currentDevice;
    // ⬇️ Modal to change answer after saving answer
    const [coverAnswer, setCoverAnswer] = useState(false);
    const [showModalToChangeAnswer, setShowModalToChangeAnswer] = useState(false);
    const handleOpenChangeAnswerModal = () => {
        setCoverAnswer(false);
        setShowModalToChangeAnswer(true);
    };
    const quitModal = () => {
        setShowModalToChangeAnswer(false);
        setCoverAnswer(true);
    };
    const changeAnswer = () => {
        setShowModalToChangeAnswer(false);
        dispatch(currentActions.deleteAnswer({ device: data.device, number: data.questionNumber }));
    }
    // ⬆️ Modal to change answer after saving answer

    const handleSave = () => {
        // Upon save: send the gradingPoints (derived from blanksStatus & data.points) to Redux store
        // Send also the "blanksValues" state to get statistics about how the question gets answered
        const draftPoints = blanksStatus.reduce((previousValue, currentValue) => currentValue === 2 ? previousValue + 1 : previousValue, 0);
        const points = (draftPoints * data.points) / blanksStatus.length;
        // blanksValues is the RULER that shows the actual answer. The correct is [1,2,3,4,5,6], whereas user answered [2,1,3,4,6,5]
        dispatch(currentActions.addAnswer({ device: currentDevice, number: data.questionNumber, kind: data.kind, answer: blanksValues, points: points }));
        setCoverAnswer(true);
        if (currentQuestion !== numberOfQuestionsInCurrentModule) dispatch(currentActions.nextQuestion());
    };

    // RENDER BLANKS THROUGH useMEMO!
    // calculate the left/right/top/bottom of every blank and put that in a Memoized array
    const allBlanks = useMemo(() => {
        const blankArea = (num: number) => (
            <div id={`b${num}`} key={num} className={classes.blank}>{num.toString()}</div>
        );
        return data.stickers.map((sticker, idx) => blankArea(idx+1));
    }, [data.stickers]);

    const handleUpdateBlanksStatus = (prevBlank: number, currentBlank?: number, correctBlank?: boolean) => {
        // prevBlank (ranges from 0,1-6) -- the previous blank number the sticker was on (0=inBank, 1-6=onBlank)
        // currentBlank (ranges from 0-5) -- the blank index we should land on
        // we use typeof X === 'number' because X can be 0 (which is different from X being null!)
        // returning [...prev] in setBlanksStatus so as to return a NEW array to cause a Re-render        
        if (typeof currentBlank === 'number') { // if sticker just landed on a blank & maybe been on another blank
            if (correctBlank) { // if sticker just landed on the correct blank & maybe been on another blank
                setBlanksStatus(prev => {prev[currentBlank] = 2; if (prevBlank > 0) { prev[prevBlank-1] = 0 }; return [...prev]});
            } else { // if sticker just landed on the wrong blank & maybe been on another blank
                setBlanksStatus(prev => {prev[currentBlank] = 1; if (prevBlank > 0) { prev[prevBlank-1] = 0 }; return [...prev]});
            }
        } else if (prevBlank > 0) { // if sticker doesn't land on blank, but has been on a blank
            setBlanksStatus(prev => {
                const newArr = [...prev];
                newArr[prevBlank-1] = 0;
                return newArr;
            });
        }
        // if sticker doesn't land on blank and hasn't been on blank - don't change blanksStatus array
    };
    const handleUpdateBlanksValues = (blankId: number, numberInImagePutOnThisBlank: number) => {
        setBlanksValues(prev => { const newArr = [...prev]; newArr[blankId] = numberInImagePutOnThisBlank; return newArr });
    };

    return (
        <>
            {show && <div style={{ maxHeight: "85vh", maxWidth: "100vw" }}>
                <div className={classes.prompt}>
                    {data.prompt}
                </div>
                <div className={classes.stickerBank}>
                    {!blanksStatus.includes(0) && <UIButton label="שמור תשובה" active={true} handler={handleSave} top="33vh" />}
                    {shuffledStickers.map((sticker, idx) => <Sticker key={idx.toString()+sticker.text} stickerId={idx} stickerPlace={stickerPlaces[idx]} handleUpdateStickerPlace={updateStickerPlace} stickerText={sticker.text} numberInImage={sticker.numberInImage} stickerRadii={{ left: 0.175*vw, top: 0.0125*vh }} numberOfStickers={data.stickers.length} blanksStatus={blanksStatus} handleUpdateBlanksStatus={handleUpdateBlanksStatus} handleUpdateBlanksValues={handleUpdateBlanksValues} gridArea={gridAreas[idx]} />)}
                </div>
                <div className={classes.blanksArea}>
                    {allBlanks}
                </div>
                <img src={data.image.path} alt={data.image.alt} style={{ height: "auto", maxWidth: "100vw", maxHeight: "26vh" }} />
                {coverAnswer && ReactDOM.createPortal(<ModalBackgroundClicksPrevention handler={handleOpenChangeAnswerModal} top={15} />, portalElement)}
            {showModalToChangeAnswer && ReactDOM.createPortal(<TwoButtonModal prompt="תרצו לשנות תשובה?" textLeft="לא" textRight="כן" colorSide='left' color="#B91118" activeSide="right" handleActive={changeAnswer} handleQuit={quitModal} />, portalElement)}
            </div>}
        </>
    );
};

export default DragQuestion;