import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { scoreObjt } from "./deviceScoresSlice";
import { set } from 'idb-keyval';

type ScoresObject = Record<string, { cloudStatus: "local" | "imported" | "uploaded", scores: number[] }>;
type Device = Record<string, ScoresObject>;
type Unit = Record<string, Device>;
type ScoreBoard = Record<string, Unit>;

const initialScoreBoard: ScoreBoard = {};

const scoreBoardSlice = createSlice({
    name: 'scoreBoard',
    initialState: initialScoreBoard,
    reducers: {
        initiateScoreBoard(state, action: PayloadAction<{ unitsPerHouse: Record<string, string[]> }>) {
            for (const house in action.payload.unitsPerHouse) {
                let objectWithUnitsAsKeys: Unit = {};
                for (const unit of action.payload.unitsPerHouse[house]) {
                    objectWithUnitsAsKeys[unit] = {};
                }
                state[house] = objectWithUnitsAsKeys;
            }
        },
        reinitiateScoreBoardFromIDB(state, action) {
            return action.payload;
        },
        // ⬇️ UPON FIRST PLAYER FROM UNIT OPENING DEVICE MODULE
        addDeviceToUnit(state, action: PayloadAction<{ house: string, unit: string, device: string, maxPointsPerQuestion: number[] }>) {
            const { house, unit, device, maxPointsPerQuestion } = action.payload; 
            if (!Object.keys(state[house][unit]).includes(device)) {
                state[house][unit][device] = {} ;
            }
            state[house][unit][device].totals = { cloudStatus: "local", scores: maxPointsPerQuestion };
        },
        undoAddDeviceToUnit(state, action: PayloadAction<{ house: string, unit: string, device: string }>) {
            const { house, unit, device } = action.payload;
            delete state[house][unit][device];
        },
        addPlayerScoresForModule(state, action: PayloadAction<{ house: string, unit: string, device: string, player: string, scores: number[] }>) {
            const { house, unit, device, player, scores } = action.payload;
            state[house][unit][device][player] = { cloudStatus: "local", scores: [] };
            state[house][unit][device][player].scores.push(...scores);
            set('scoreBoard', JSON.stringify(state)).then(() => console.log('saved scoreBoard in IDB')).catch((err) => console.log(`Error in scoreBoard: ${err}`));
        },
        addDeviceToUnitFromCloud(state, action: PayloadAction<{ house: string, unit: string, device: string, scoreTable: scoreObjt[], maxPointsPerQuestion: number[] }>) {
            const { house, unit, device, scoreTable, maxPointsPerQuestion } = action.payload;
            if (!Object.keys(state[house][unit]).includes(device)) {
                state[house][unit][device] = {} ;
                for (const scoreRuler of scoreTable) {
                    state[house][unit][device][scoreRuler.playerName] = { cloudStatus: "imported", scores: scoreRuler.scores };
                }
                state[house][unit][device].totals = { cloudStatus: "imported", scores: maxPointsPerQuestion };
            }
            // if device already exists in scoreBoard then don't do anything (if it is local or already imported)
        }
    }
});

export default scoreBoardSlice;