import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookie from "js-cookie";
import { BASE_URL } from "../../services/helper";

// Action for register
export const userDetails = createAsyncThunk("userDetails", async () => {
    const userID = Cookie.get("userID");
    const response = await axios.get(`${BASE_URL}/api/user/${userID}`);
    return response.data;
});

const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
        name: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(userDetails.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(userDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.name = action.payload.name;
        });
        builder.addCase(userDetails.rejected, (state, action) => {
            state.isError = true;
            console.log("Error: ", action.payload);
        });
    },
});

export default userDetailsSlice.reducer;
