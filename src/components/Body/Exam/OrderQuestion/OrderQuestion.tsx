import ReactDOM from 'react-dom';
import React, { useMemo, useState } from "react";
import { OrderQuestionData } from "../../../../types/question-types";
import UIButton from "../../../UI/UIButton";
import OrderedItem from "./OrderedItem";
import classes from './OrderQuestion.module.css';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import ModalBackgroundClicksPrevention from "../../../UI/ModalBackgroundClicksPrevention";
import TwoButtonModal from "../../../UI/TwoButtonModal";
import { currentActions } from "../../../../store/redux-logic";
import { portalElement } from '../../../../elements/portalElement';


const OrderQuestion = ({ data }: { data: OrderQuestionData }) => {
    // give 1 point per: putting item in correct Number [OR] putting one item after the one that's supposed to be before it
    // this allows the competitor to err in one item but do the rest correctly (but frameshifted)
    const initialUserOrderArray = Array.from({length: data.items.length}, () => 0); // 0 = not ordered
    const [userOrderArray, setUserOrderArray] = useState(initialUserOrderArray);
    const shuffledItems = useMemo(() => _.shuffle(data.items), [data.items]);
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
        // --> Update Redux store with BOTH points and actual orderArray
        // extract the realOrderArray from data:
        const realOrderArray = [...initialUserOrderArray]; // get array of same length
        shuffledItems.forEach((item, idx) => { realOrderArray[idx] = item.order });

        // extract the flow:
        const indicesForFlow = [...initialUserOrderArray]; // get array of same length
        indicesForFlow.forEach((val, idx) => { indicesForFlow[idx] = realOrderArray.findIndex(i => i === realOrderArray[idx] + 1) });
        // will look like: [1,4,-1,0,2] --> -1 means it's the last item in order, make array circular by having it point to where 0 is:
        indicesForFlow[indicesForFlow.findIndex(i => i === -1)] = indicesForFlow.findIndex(i => i === 0);
        // will turn into: [1,4,3,0,2]

        const gradingArray = [...initialUserOrderArray];
        gradingArray.forEach((val, idx) => {
            const isInRightOrder = userOrderArray[idx] + 1 === userOrderArray[indicesForFlow[idx]];
            const isInRightPlace = userOrderArray[idx] === realOrderArray[idx];
            gradingArray[idx] = isInRightOrder || isInRightPlace ? 1 : 0;
        });
        // gradingArray will look like [0,1,1,1,1]
        //console.log(gradingArray);
        //console.log('score is '+ gradingArray.reduce((previousValue, currentValue) => previousValue+currentValue, 0));
        // send to Redux: both the grade & userOrderArray
        const draftPoints = gradingArray.reduce((previousValue, currentValue) => previousValue+currentValue, 0);
        const points = (draftPoints * data.points) / gradingArray.length;
        console.log(`OrderQ: (${draftPoints} * ${data.points} / ${gradingArray.length} = ${points})`);
        dispatch(currentActions.addAnswer({ device: currentDevice, number: data.questionNumber, kind: data.kind, answer: userOrderArray, points: points }));
        setCoverAnswer(true);
        if (currentQuestion !== numberOfQuestionsInCurrentModule) dispatch(currentActions.nextQuestion());
    };
    
    const handleAssignOrder = (itemId: number,itemNum: number) => {
        setUserOrderArray(prev => {
            const newArr = [...prev];
            newArr[itemId] = itemNum;
            return newArr;
        });
    };
    const resetOrderArrayFromHereOnward = (itemId: number) => {
        setUserOrderArray(prev => {
            const newArr = [...prev];
            newArr.forEach((num, idx) => { if (num >= prev[itemId] || num === 0) { newArr[idx] = 0; } });
            return newArr;
        });
    };
    
    return (
        <>
            {show && <div style={{ maxHeight: "85vh", maxWidth: "100vw" }}>
                <div className={classes.prompt}>
                    {data.prompt}
                </div>
                <div className={classes.itemsWrapper}>
                    {shuffledItems.map((item, idx) => <OrderedItem key={idx} itemId={idx} text={item.text} currentHighest={Math.max(...userOrderArray)} assignedNumber={userOrderArray[idx]} handleAssignOrder={handleAssignOrder} resetOrderArrayFromHereOnward={resetOrderArrayFromHereOnward} />)}
                </div>
                <UIButton label="שמור תשובה" active={!userOrderArray.includes(0)} handler={handleSave} />
                {coverAnswer && ReactDOM.createPortal(<ModalBackgroundClicksPrevention handler={handleOpenChangeAnswerModal} top={15} />, portalElement)}
            {showModalToChangeAnswer && ReactDOM.createPortal(<TwoButtonModal prompt="תרצו לשנות תשובה?" textLeft="לא" textRight="כן" colorSide='left' color="#B91118" activeSide="right" handleActive={changeAnswer} handleQuit={quitModal} />, portalElement)}
            </div>}
        </>
    );
};

export default OrderQuestion;