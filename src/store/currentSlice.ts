import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type response = { number: number, kind: string, answer: boolean[] | string[] | number[] | number, points: number };
export type moduleAnswers = { device: string, answers: response[], scores: number[] };
export type progressState = { house: string, unit: string, player: string, modulesAnswers: moduleAnswers[]};
interface currentState extends progressState {
    currentDevice: string;
    currentQuestion: number;
    numberOfQuestionsInCurrentModule: number;
    timerRunning: boolean;
    playersWhoPlayed: number[];
    timeLeftForBackup: number;
    viewHouseScore: string;
}

const initialCurrentState: currentState = {
    house: "", unit: "", player: '1', currentDevice: "", currentQuestion: 1,
    numberOfQuestionsInCurrentModule: 0, timerRunning: false, modulesAnswers: [], playersWhoPlayed: [], timeLeftForBackup: 300000, viewHouseScore: "none"
};


const currentSlice = createSlice({
    name: 'current',
    initialState: initialCurrentState,
    reducers: {
        enterHouse(state, action) {
            state.house = action.payload;
        },
        enterUnit(state, action) {
            state.unit = action.payload;
        },
        enterHouseAndUnit(state, action) {
            state.house = action.payload.house;
            state.unit = action.payload.unit;
        },
        clearHouseAndUnit(state) {
            state.house = "";
            state.unit = "";
        },
        enterPlayer(state, action) {
            state.player = action.payload;
        },
        setCurrentDevice(state, action) {
            state.currentDevice = action.payload;
        },
        setCurrentQuestion(state, action) {
            state.currentQuestion = action.payload;
        },
        nextQuestion(state) {
            state.currentQuestion += 1;
        },
        prevQuestion(state) {
            state.currentQuestion -= 1;
        },
        exitModulePrematurelyWithoutSaving(state) {
            state.modulesAnswers = [];
            state.currentDevice = "";
            state.currentQuestion = 1;
            state.timerRunning = false;
        },
        exitModulePrematurelyAndSave(state) {
            state.currentDevice = "";
            state.currentQuestion = 1;
            state.timerRunning = false;
        },
        setTimerOn(state) { // upon opening first module of exam
            state.timerRunning = true;
        },
        setTimerOff(state) {
            state.timerRunning = false;
        },
        startModule(state, action: PayloadAction<{device: string, numberOfQuestionsInCurrentModule: number, player: string }>) { // upon opening any of the modules in exam (upon 1st module this will be coupled with setTimerOn)
            const module: moduleAnswers = { device: action.payload.device, answers: [], scores: Array.from({length: action.payload.numberOfQuestionsInCurrentModule}, x => 0)};
            state.modulesAnswers.push(module);
            state.numberOfQuestionsInCurrentModule = action.payload.numberOfQuestionsInCurrentModule;
            state.playersWhoPlayed.push(parseInt(action.payload.player));
        },
        addAnswer(state, action) {
            state.modulesAnswers.find(m => m.device === action.payload.device)!.answers.push({
                number: action.payload.number,
                kind: action.payload.kind,
                answer: action.payload.answer,
                points: action.payload.points
            });
            state.modulesAnswers.find(m => m.device === action.payload.device)!.scores[action.payload.number-1] = action.payload.points;
        },
        clearAnswers(state) {
            state.modulesAnswers = [];
        },
        deleteAnswer(state, action: PayloadAction<{ device: string, number: number }>) {
            state.modulesAnswers.find(m=> m.device === action.payload.device)!.answers
                .splice(state.modulesAnswers.find(m=> m.device === action.payload.device)!.answers.findIndex(a => a.number === action.payload.number), 1);
            // DELETE ANSWERS ONCE ENTERING EDIT MODE!!!!
        },
        clearPlayersWhoPlayed(state) {
            state.playersWhoPlayed = [];
        },
        changeTimeLeftForBackup(state, action: PayloadAction<number>) {
            state.timeLeftForBackup = action.payload;
        },
        changeHouseScoreToView(state, action) {
            state.viewHouseScore = action.payload;
        }
    }
});

export default currentSlice;