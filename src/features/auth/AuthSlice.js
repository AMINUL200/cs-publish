// src/features/auth/AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.userData = action.payload.userData;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.userData = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;