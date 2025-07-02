import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from '@reduxjs/toolkit';

interface UserData {
    id: number;
    user_id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    user_type: number;
    status: number;
    created_at: string;
    updated_at: string;
}

interface AuthState {
    userData: null | UserData;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    userData: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ userData: UserData; token: string }>) {
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