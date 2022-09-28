import { createSlice } from "@reduxjs/toolkit";

type AuthStatus = { authorizationLevel: string };

const initialAuthStatus: AuthStatus = { authorizationLevel: "none" };

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthStatus,
    reducers: {
        authorize(state, action) {
            state.authorizationLevel = action.payload;
        },
        unauthorize(state) {
            state.authorizationLevel = "none";
        }
    }
});

export default authSlice;