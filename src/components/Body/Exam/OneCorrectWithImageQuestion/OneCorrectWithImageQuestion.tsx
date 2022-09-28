import ReactDOM from 'react-dom';
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { currentActions } from "../../../../store/redux-logic";
import { OneCorrectWithImageQuestionData } from "../../../../types/question-types";
import { QuestionRfc } from "../../../../types/rfc-types";
import ModalBackgroundClicksPrevention from "../../../UI/ModalBackgroundClicksPrevention";
import TwoButtonModal from "../../../UI/TwoButtonModal";
import UIButton from "../../../UI/UIButton";
import OneChoice from "../OneCorrectQuestion/OneChoice";
import classes from '../OneCorrectQuestion/OneCorrectQuestion.module.css';
import { portalElement } from '../../../../elements/portalElement';

const OneCorrectWithImageQuestion: QuestionRfc<OneCorrectWithImageQuestionData> = ({ data }) => {
    const [choiceChosen, setChoiceChosen] = useState<null | number>(null);
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
        setChoiceChosen(num);
    };

    const handleSave = () => {    // --> Update Redux store with BOTH points and actual rubric
        const points = choiceChosen === data.choices.findIndex(c => c.correct) ? data.points : 0;
        dispatch(currentActions.addAnswer({ device: currentDevice, number: data.questionNumber, kind: data.kind, answer: choiceChosen, points: points }));
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
                {data.choices.map((choice, idx) => <OneChoice key={idx} itemNumber={idx} handleChoose={handleChoose} text={choice.text} chosen={choiceChosen === idx} />)}
                <img style={{ alignSelf: "center", height: "auto", maxWidth: "100vw" }} src={data.image.path} alt={data.image.alt} />
            </div>
            <UIButton label="שמור תשובה" active={typeof choiceChosen === 'number'} handler={handleSave} />
            {coverAnswer && ReactDOM.createPortal(<ModalBackgroundClicksPrevention handler={handleOpenChangeAnswerModal} top={15} />, portalElement)}
            {showModalToChangeAnswer && ReactDOM.createPortal(<TwoButtonModal prompt="תרצו לשנות תשובה?" textLeft="לא" textRight="כן" colorSide='left' color="#B91118" activeSide="right" handleActive={changeAnswer} handleQuit={quitModal} />, portalElement)}
            </div>}
        </>
    );
};

export default OneCorrectWithImageQuestion;