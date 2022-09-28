import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { ManyCorrectQuestionData } from "../../../../types/question-types";
import { QuestionRfc } from "../../../../types/rfc-types";
import classes from './ManyCorrectQuestion.module.css';
import UIButton from "../../../UI/UIButton";
import ManyChoice from './ManyChoice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import ModalBackgroundClicksPrevention from '../../../UI/ModalBackgroundClicksPrevention';
import TwoButtonModal from '../../../UI/TwoButtonModal';
import { currentActions } from '../../../../store/redux-logic';
import { portalElement } from '../../../../elements/portalElement';

const ManyCorrectQuestion: QuestionRfc<ManyCorrectQuestionData> = ({ data }) => {
    const initialChoicesArray = Array.from({length: data.choices.length}, () => false); // [false, false, false]
    const [chosenChoices, setChosenChoices] = useState(initialChoicesArray);

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

    const handleChoose = (num: number) => {
        setChosenChoices(prev => {
            const newArr = [...prev];
            newArr[num] = !prev[num];
            return newArr;
        });
    };
    const handleSave = () => { // --> update redux store with BOTH points and actual rubric
        let draftPoints = 0;
        chosenChoices.forEach((c, idx) => c === data.choices[idx].correct ? draftPoints++ : draftPoints--);
        if (draftPoints < 0) { draftPoints = 0 };
        const points = (draftPoints * data.points) / chosenChoices.length; 
        dispatch(currentActions.addAnswer({ device: currentDevice, number: data.questionNumber, kind: data.kind, answer: chosenChoices, points: points }));
        setCoverAnswer(true);
        if (currentQuestion !== numberOfQuestionsInCurrentModule) dispatch(currentActions.nextQuestion());
    };
    
    return (
        <>
            {show && <div style={{ maxHeight: "85vh", maxWidth: "100vw" }}>
                <div className={classes.prompt}>
                    {data.prompt}
                </div>
                <div className={classes.choicesWrapper}>
                    {data.choices.map((choice, idx) => <ManyChoice key={idx} itemNumber={idx} handleChoose={handleChoose} text={choice.text} chosen={chosenChoices[idx]} />)}
                </div>
                <UIButton label="שמור תשובה" active={chosenChoices.includes(true)} handler={handleSave} />
                {coverAnswer && ReactDOM.createPortal(<ModalBackgroundClicksPrevention handler={handleOpenChangeAnswerModal} top={15} />, portalElement)}
                {showModalToChangeAnswer && ReactDOM.createPortal(<TwoButtonModal prompt="תרצו לשנות תשובה?" textLeft="לא" textRight="כן" colorSide='left' color="#B91118" activeSide="right" handleActive={changeAnswer} handleQuit={quitModal} />, portalElement)}
            </div>}
        </>
    );
};

export default ManyCorrectQuestion;