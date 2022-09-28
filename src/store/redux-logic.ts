import { configureStore } from '@reduxjs/toolkit';
import housesSlice from './housesSlice';
import unitsSlice from './unitsSlice';
import currentSlice from './currentSlice';
import scoreBoardSlice from './scoreBoardSlice';
import cloudSlice from './cloudSlice';
import authSlice from './authSlice';
import deviceScoresSlice from './deviceScoresSlice';

const store = configureStore({
    reducer: { houses: housesSlice.reducer,
               units: unitsSlice.reducer,
               current: currentSlice.reducer,
               deviceScores: deviceScoresSlice.reducer, 
               scoreBoard: scoreBoardSlice.reducer,
               cloud: cloudSlice.reducer,
               auth: authSlice.reducer }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const housesActions = housesSlice.actions;
export const unitsActions = unitsSlice.actions;
export const currentActions = currentSlice.actions;
export const deviceScoresActions = deviceScoresSlice.actions;
export const scoreBoardActions = scoreBoardSlice.actions;
export const cloudActions = cloudSlice.actions;
export const authActions = authSlice.actions;
export default store;