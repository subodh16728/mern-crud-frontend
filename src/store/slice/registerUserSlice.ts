import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RegisterActionPayload, UserInitialState } from "../../utils/model";
import { BASE_URL } from "../services/helper";

// Action for register
export const registerUser = createAsyncThunk("registerUser", async (data) => {
    const response = await axios.post(`${BASE_URL}/api/register`, data);
    console.log("Register User response: ", response)
    return response.data;
});

// Action for login
export const loginUser = createAsyncThunk("loginUser", async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/login`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

const initialState: UserInitialState = {
    isLoading: false,
    isError: false,
    name: "",
    data: {
        data: {},
        error: false,
        message: false,
        success: ""
    },
};

const registerUserSlice = createSlice({
    name: "registerUser",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(
            registerUser.fulfilled,
            (state, action: PayloadAction<RegisterActionPayload>) => {
                state.isLoading = false;
                state.data = action.payload;
                if (state.data.success) {
                    console.log("Action payload: ", action.payload);
                    state.name = action.payload.data.name;
                    console.log("State.name: ", state.name);
                }
            }
        );
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            if (action.payload && action.payload.name) {
                state.name = action.payload.name;
            }
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isError = true;
        });
    },
});

export default registerUserSlice.reducer;
