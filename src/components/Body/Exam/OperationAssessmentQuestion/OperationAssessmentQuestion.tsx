import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { currentActions } from '../../../../store/redux-logic';
import { OperationAssessmentQuestionData } from "../../../../types/question-types";
import { QuestionRfc } from "../../../../types/rfc-types";
import CodeModalOneInput from '../../../UI/CodeModalOneInput';
import UIButton from "../../../UI/UIButton";
import classes from './OperationAssessmentQuestion.module.css';
import TaskItem from './TaskItem';

export type assess = "none" | "wrong" | "correct";

const portalElementAsArray = document.querySelectorAll<HTMLElement>("#overlay-root");
const portalElement = portalElementAsArray[0];

const OperationAssessmentQuestion: QuestionRfc<OperationAssessmentQuestionData> = ({ data }) => {
    const [permissionGiven, setPermissionGiven] = useState(false);
    const [codeModalShown, setCodeModalShown] = useState(false);
    const initialAssessmentArray: assess[] = Array.from({length: data.tasks.length}, () => "none"); // "none" | "wrong" | "correct"
    const [assessmentArray, setAssessmentArray] = useState<assess[]>(initialAssessmentArray);
    const currentQuestion = useAppSelector(state => state.current.currentQuestion);
    const numberOfQuestionsInCurrentModule = useAppSelector(state => state.current.numberOfQuestionsInCurrentModule);
    const currentDevice = useAppSelector(state => state.current.currentDevice);
    const dispatch = useAppDispatch();
    const show = data.questionNumber === currentQuestion && data.device === currentDevice;
    // ⬇️ Change answer after saving it
    const [showAssessmentSaved, setShowAssessmentSaved] = useState(false);
    const editAssessment = () => {
        setCodeModalShown(true);
        setShowAssessmentSaved(false);
        dispatch(currentActions.deleteAnswer({ device: data.device, number: data.questionNumber }));
    };
    // ⬆️ Change answer after saving it

    const toggleCodeModal = () => {
        setCodeModalShown(prev => !prev);
    };
    const continueOntoAssessment = () => {
        setCodeModalShown(false);
        setPermissionGiven(true);
    };
    const handleCorrectWrong = (taskId: number, correctWrong: assess) => {
        setAssessmentArray(prev => {
            const newArr = [...prev];
            newArr[taskId] = correctWrong;
            return newArr;
        });
    }
    const handleSave = () => {   // --> Update Redux store with BOTH points and actual rubric
        let draftPoints = 0;
        assessmentArray.forEach(a => a === "correct" && draftPoints++);
        const points = (draftPoints * data.points) / assessmentArray.length;
        dispatch(currentActions.addAnswer({ device: currentDevice, number: data.questionNumber, kind: data.kind, answer: assessmentArray, points: points }));
        setShowAssessmentSaved(true);
        setPermissionGiven(false);
    };

    const passOnToBMERep = (
        <>
            <p style={{ color: "#8a8a8a", fontSize: "1.3rem", marginTop: "14vh", marginLeft: "10vw", marginRight: "10vw" }}>העבירו את היישומון לידי נציג הנדסה רפואית</p>
            <UIButton label="כניסה למחוון" active={true} handler={toggleCodeModal} top="56vh" />
        </>
    );
    const assessment = (
        <>
            {data.tasks.map((task, idx) => <TaskItem key={idx} text={task} taskId={idx} status={assessmentArray[idx]} handleCorrectWrong={handleCorrectWrong} />)}
            <div><div style={{ height: "11vh" }}></div></div>
            <UIButton label="שמור מחוון" active={!assessmentArray.includes("none")} handler={handleSave} />
        </>
    );
    const assessmentSaved = (
        <>
            <h2>מחוון נשמר!</h2>
            <div onClick={editAssessment} className={classes.editButton}><div style={{ position: "relative", margin: "auto" }}>עריכה</div></div>
            {currentQuestion !== numberOfQuestionsInCurrentModule && <UIButton label="הבא" active={true} handler={() => dispatch(currentActions.nextQuestion())} />}
        </>
    );

    return (
        <>
            {show && <>
                <div className={classes.prompt}>
                    {data.prompt}
                </div>
                <div className={classes.assessmentWrapper}>
                    {!permissionGiven && !showAssessmentSaved && passOnToBMERep}
                    {codeModalShown && ReactDOM.createPortal(<CodeModalOneInput text="הזן קוד נציג הנדסה רפואית" requiredCodes={["1111","1234","2222"]} proceed={continueOntoAssessment} goBack={toggleCodeModal} topForBackground={15} />, portalElement)}
                    {permissionGiven && !showAssessmentSaved && assessment}
                    {showAssessmentSaved && assessmentSaved}
                </div>
            </>}
        </>
    );
};

export default OperationAssessmentQuestion;