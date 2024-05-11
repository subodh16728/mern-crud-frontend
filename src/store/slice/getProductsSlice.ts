import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookie from "js-cookie";
import axios from "axios";
import { ProductInitialState, TotalProduct } from "../../utils/model";
import { BASE_URL } from "../services/helper";

// Action
export const fetchProducts = createAsyncThunk("fetchProducts", async (search) => {
    const token = Cookie.get("token")
    const response = await axios.get(`${BASE_URL}/api/products?search=${search}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
});

const initialState: ProductInitialState = {
    isLoading: false,
    data: [],
    isError: false
}

const apiSlice = createSlice({
    name: "fetchapi",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts
            .pending, (state) => {
                state.isLoading = true;
            });
        builder.addCase(fetchProducts
            .fulfilled, (state, action: PayloadAction<TotalProduct[]>) => {
                state.isLoading = false;
                state.data = action.payload;
                console.log("Action payload: ", action.payload)
            });
        builder.addCase(fetchProducts
            .rejected, (state) => {
                state.isError = true;
            });
    }
})

export default apiSlice.reducer;