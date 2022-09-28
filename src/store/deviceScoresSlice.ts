import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from 'idb-keyval';


export type RawAnswer = { number: number, kind: string, answer: boolean[] | string[] | number[] | number };

export type scoreObjt = { playerName: string, scores: number[] };
export type answerObj = { playerName: string, answers: RawAnswer[] };

export type DeviceScore = {
    deviceName: string,
    house: string,
    unit: string,
    maxScorePerQuestion: number[],
    scoreTable: scoreObjt[],
    rawAnswers: answerObj[],
    uploadedFrom: string,
    testDate: number,
    uploaded: "no" | "partially" | "fully"
};

const initialDeviceScores: DeviceScore[] = [];


const deviceScoresSlice = createSlice({
    name: 'deviceScores',
    initialState: initialDeviceScores,
    reducers: {
        reinitiateDeviceScoresFromIDB(state, action) {
            return action.payload;
        },
        addDeviceScorePerPlayer(state, action: PayloadAction<{ deviceName: string, house: string, unit: string, player: string, playerScores: number[], playerAnswers: RawAnswer[], uploadedFrom: string, testDate: number }>) {
            const { deviceName, house, unit, player, playerScores, playerAnswers, uploadedFrom, testDate } = action.payload;
            if (state.find(s => s.house === house && s.deviceName && deviceName && s.unit === unit)) {
                const deviceScoresObj = state.find(s => s.house === house && s.deviceName && deviceName && s.unit === unit)!;
                deviceScoresObj.scoreTable.push({ playerName: player, scores: playerScores });
                deviceScoresObj.rawAnswers.push({ playerName: player, answers: playerAnswers });
                deviceScoresObj.uploadedFrom = uploadedFrom;
                deviceScoresObj.testDate = testDate;
            } else {
                // initiate a new deviceScore object if it doesn't exist yet:
                state.push({ deviceName: deviceName, house: house, unit: unit, maxScorePerQuestion: [], scoreTable: [{ playerName: player, scores: playerScores }], rawAnswers: [{ playerName: player, answers: playerAnswers }], uploadedFrom: uploadedFrom, testDate: testDate, uploaded: "no" });
            }
            set('deviceScores', JSON.stringify(state)).then(() => console.log('saved deviceScores in IDB')).catch((err) => console.log(`Error in deviceScores: ${err}`));
        },
        addDeviceScoreMaxScores(state, action: PayloadAction<{ deviceName: string, house: string, unit: string, maxScorePerQuestion: number[], uploadedFrom: string, testDate: number }>) {
            const { deviceName, house, unit, maxScorePerQuestion, uploadedFrom, testDate } = action.payload;
            if (state.find(s => s.house === house && s.deviceName && deviceName && s.unit === unit)) {
                const deviceScoresObj = state.find(s => s.house === house && s.deviceName && deviceName && s.unit === unit)!;
                deviceScoresObj.maxScorePerQuestion = maxScorePerQuestion;
            } else { // This is what actually gets executed first - other if/else statements in this&above reducer are unnecessary
                state.push({ deviceName: deviceName, house: house, unit: unit, maxScorePerQuestion: maxScorePerQuestion, scoreTable: [], rawAnswers: [], uploadedFrom: uploadedFrom, testDate: testDate, uploaded: "no" });
            }
        },
        removeDeviceScoreUponConfusion(state, action: PayloadAction<{ house: string, unit: string, player: string }>) {
            const { house, unit, player } = action.payload;
            if (state.find(s => s.house === house && s.unit === unit)!.scoreTable.length > 0) {
                const deviceScoreObj = state.find(s => s.house === house && s.unit === unit);
                if (deviceScoreObj) {
                    deviceScoreObj.scoreTable = deviceScoreObj.scoreTable.filter(t => t.playerName !== player);
                    deviceScoreObj.rawAnswers = deviceScoreObj.rawAnswers.filter(a => a.playerName !== player);
                }
            } else {
                const idx = state.findIndex(s => s.house === action.payload.house && s.unit === action.payload.unit);
                state.splice(idx, 1);
            }
        },
        markAllAsUploaded(state) {
            state.forEach(d => {
                if (d.scoreTable.length === 3) {
                    d.uploaded = "fully";
                } else {
                    d.uploaded = "partially";
                }
            });
        }
    }
});

export default deviceScoresSlice;