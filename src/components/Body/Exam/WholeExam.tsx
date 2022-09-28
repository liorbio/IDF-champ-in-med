import { useEffect, useState, useMemo } from "react";
import { DragQuestionData, ManyCorrectQuestionData, OneCorrectQuestionData, OneCorrectWithImageQuestionData, OperationAssessmentQuestionData, OrderQuestionData, QuestionData } from "../../../types/question-types";
import DragQuestion from "./DragQuestion/DragQuestion";
import ManyCorrectQuestion from "./ManyCorrectQuestion/ManyCorrectQuestion";
import OneCorrectQuestion from "./OneCorrectQuestion/OneCorrectQuestion";
import OperationAssessmentQuestion from "./OperationAssessmentQuestion/OperationAssessmentQuestion";
import OrderQuestion from "./OrderQuestion/OrderQuestion";
import classes from './WholeExam.module.css';
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

import { currentActions, deviceScoresActions, scoreBoardActions } from "../../../store/redux-logic";
import ModuleCover from "./ModuleCover";
import OneCorrectWithImageQuestion from "./OneCorrectWithImageQuestion/OneCorrectWithImageQuestion";

type Module = { device: string, questions: QuestionData[] };

const WholeExam = () => {
    const [bank, setBank] = useState<Module[]>([]);
    const [maxPointsPerQuestion, setMaxPointsPerQuestion] = useState<Record<string, number[]>>({});
    const currentDevice = useAppSelector(state => state.current.currentDevice);
    const house = useAppSelector(state => state.current.house);
    const unit = useAppSelector(state => state.current.unit);
    const player = useAppSelector(state => state.current.player);
    const timerRunning = useAppSelector(state => state.current.timerRunning);
    const phoneName = useAppSelector(state => state.cloud.phoneName);

    const dispatch = useAppDispatch();

    // When we have a whole back-end with Mongo:
    // Touch local storage to get question [device; questionNumber] (after ServiceWorker got questions from DB)
    // ** check how JSON questions should be stored in local storage

    // for now, we will fetch questions from public folder.

    useEffect(() => {
        const populateBank = async () => {
            const resp = await fetch('/questionBank.JSON');
            const data = await resp.json();
            setBank(data);
            const draftMaxPointsPerQuestion: Record<string, number[]> = {};
            for (const module of data as Module[]) {
                const maxPointsRuler = module.questions.map(q => q.points);
                draftMaxPointsPerQuestion[module.device] = maxPointsRuler;
            }
            setMaxPointsPerQuestion(draftMaxPointsPerQuestion);
        };
        try {
            populateBank();
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Populate QuestionBody via map to put all necessary RFCs (we end up with a list of RFCs for the module)
    // Each RFC has its own state-- therefore by flipping through RFCs the answers stay
    // Whether a Question is shown or not is dictated by Redux state (a "show" const inside of the Question RFC itself - each Question consumes a Redux slice)
    const currentHouse = useAppSelector(state => state.current.house);
    const devicesForCurrentHouse = useAppSelector(state => state.houses.houses[currentHouse]); 

    const mergedModules = useMemo(() => {
        const questionsRfcList = (devices: string[]) => {
            const modules = bank.filter(d => devices.includes(d.device));
            const questionsArray: QuestionData[] = [];
            modules.forEach(m => questionsArray.push(...m.questions));
            return (
                <>
                        {questionsArray.map((qData, idx) => {
                            switch (qData.kind) {
                                case "drag":
                                    return <DragQuestion key={`${qData.device}${qData.questionNumber}${idx}`} data={qData as DragQuestionData} />;
                                case "one-correct":
                                    return <OneCorrectQuestion key={`${qData.device}${qData.questionNumber}${idx}`} data={qData as OneCorrectQuestionData} />;
                                case "one-correct-with-image":
                                    return <OneCorrectWithImageQuestion key={`${qData.device}${qData.questionNumber}${idx}`} data={qData as OneCorrectWithImageQuestionData} />;
                                case "many-correct":
                                    return <ManyCorrectQuestion key={`${qData.device}${qData.questionNumber}${idx}`} data={qData as ManyCorrectQuestionData} />;
                                case "operation-assessment":
                                    return <OperationAssessmentQuestion key={`${qData.device}${qData.questionNumber}${idx}`} data={qData as OperationAssessmentQuestionData} />;
                                case "order":
                                    return <OrderQuestion key={`${qData.device}${qData.questionNumber}${idx}`} data={qData as OrderQuestionData} />;
                                default:
                                    return <></>;
                            }
                        }) }
                    </>
            );
        };
        if (bank.length > 0) {
            return questionsRfcList(devicesForCurrentHouse);
        } else {
            return <></>;
        }
    }, [devicesForCurrentHouse, bank]);
    
    const handleEnterModule = (selectedDevice: string) => {
        if (!timerRunning) {
            dispatch(currentActions.setTimerOn());
            dispatch(currentActions.clearAnswers());
        }
        dispatch(currentActions.setCurrentDevice(selectedDevice));
        dispatch(currentActions.startModule({ device: selectedDevice, numberOfQuestionsInCurrentModule: bank.find(d => d.device === selectedDevice)!.questions.length, player: player }));
        dispatch(deviceScoresActions.addDeviceScoreMaxScores({ deviceName: selectedDevice, house: house, unit: unit, maxScorePerQuestion: maxPointsPerQuestion[selectedDevice], uploadedFrom: phoneName, testDate: new Date().getTime() }));
        dispatch(scoreBoardActions.addDeviceToUnit({ house: house, unit: unit, device: selectedDevice, maxPointsPerQuestion: maxPointsPerQuestion[selectedDevice] }));
    };
    
    const examWhole = (
        bank.length > 0 &&
        <>
            {!currentDevice && <div style={{ display: "flex", width: "100vw", flexDirection: "column", alignItems: "center" }}>{devicesForCurrentHouse.map(d => <ModuleCover key={d + new Date().toISOString()} device={d} numberOfQuestions={bank.find(m => m.device === d)!.questions.length} handleEnterModule={handleEnterModule} />)} </div>}
            {mergedModules}
        </>
    );

    return (
        <div className={classes.questionBody}>
            {examWhole}
        </div>
    );
};
export default WholeExam;