import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from 'idb-keyval';

type housesSliceState = { currentlyChooseFor: string, houses: Record<string, string[]>};

const initialHousesState: housesSliceState = { currentlyChooseFor: "", houses: {}};

const housesSlice = createSlice({
    name: 'houses',
    initialState: initialHousesState,
    reducers: {
        moveToPrevHouseToChooseFor(state) {
            const keysArray = Object.keys(state.houses);
            state.currentlyChooseFor = keysArray[keysArray.findIndex(h => h === state.currentlyChooseFor) - 1];
        },
        moveToNextHouseToChooseFor(state) {
            const keysArray = Object.keys(state.houses);
            const thisIsLastHouse = state.currentlyChooseFor === keysArray[keysArray.length-1];
            if (thisIsLastHouse || state.currentlyChooseFor === "") {
                state.currentlyChooseFor = keysArray[0];
            } else {
                state.currentlyChooseFor = keysArray[keysArray.findIndex(h => h === state.currentlyChooseFor) + 1];
            }
        },
        setHouses(state, action: PayloadAction<string[]>) {
            for (const house of action.payload) {
                state.houses[house] = [];
            }
            state.currentlyChooseFor = Object.keys(state.houses)[0];
        },
        reinitiateDevicesForHousesFromIDB(state, action) {
            state.houses = action.payload;
        },
        setDevicesForHouses(state, action: PayloadAction<Record<string, string[]>>) {
            state.houses = action.payload;
            set('housesDevices', action.payload).then(() => console.log('saved housesDevices in IDB')).catch((err) => console.log(`Error in houses: ${err}`));
        },
        clearDevicesForHouse(state, action: PayloadAction<string>) {
            state.houses[action.payload] = [];
        },
        clearDevicesForAllHouses(state) {
            for (const key in state) {
                state.houses[key] = [];
            }
        }
    }
});

export default housesSlice;