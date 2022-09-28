import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from 'lodash';

type unitAction = { do: "save" | "delete", house: string, unit: string };
type unitsSliceState = { unitsPerHouse: Record<string, { units: string[], numberOfUnitsLastSync: number }>, actionsBeforeSync: unitAction[] };

const initialUnitsState: unitsSliceState = { unitsPerHouse: {}, actionsBeforeSync: [] };

const unitsSlice = createSlice({
    name: 'units',
    initialState: initialUnitsState,
    reducers: {
        initializeUnits(state, action: PayloadAction<{ house: string, units: string[] }>) {
            state.unitsPerHouse[action.payload.house] = { units: [], numberOfUnitsLastSync: 0};
            state.unitsPerHouse[action.payload.house].units = action.payload.units;
            state.unitsPerHouse[action.payload.house].numberOfUnitsLastSync = action.payload.units.length;
        },
        addUnit(state, action: PayloadAction<{ house: string, unit: string }>) {
            if (!state.unitsPerHouse[action.payload.house].units.includes(action.payload.unit)) {
                state.unitsPerHouse[action.payload.house].units.push(action.payload.unit);
            }
        },
        addManyUnits(state, action: PayloadAction<{ house: string, units: string[] }>) {
            state.unitsPerHouse[action.payload.house].units = _.union(state.unitsPerHouse[action.payload.house].units, action.payload.units);
        },
        deleteUnit(state, action: PayloadAction<{ house: string, unit: string }>) {
            state.unitsPerHouse[action.payload.house].units = state.unitsPerHouse[action.payload.house].units.filter(u => u !== action.payload.unit);
        },
        addToActionList(state, action: PayloadAction<{ whatToDo: unitAction}>) {
            state.actionsBeforeSync.push(action.payload.whatToDo);
        },
        emptyActionList(state) {
            state.actionsBeforeSync = [];
        }

    }
});

export default unitsSlice;