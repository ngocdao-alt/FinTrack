import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const initialState = {
    loading: false,
    month: null,
    year: null,
    totalBudget: 0,
    totalSpent: 0,
    totalPercentUsed: 0,
    categoryStats: [],
    error: null,
}

export const addBudget = createAsyncThunk('budget/addBudget', async ({ month, year, totalAmount, categories}, { getState, rejectWithValue }) => {
    // console.log(fields);
    
    try {
        const { token } = getState().auth;
        // const { month, year, amount, categories } = fields;

        const res = await axios.post(
            `${BACK_END_URL}/api/budget`,
            {
                month,
                year,
                totalAmount,
                categories
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const getBudget = createAsyncThunk('budget/getBudget', async (fields, { getState, rejectWithValue }) => {
    try {
        console.log("called");
        
        const { token } = getState().auth;
        const { month, year } = fields;

        const res = await axios.get(
            `${BACK_END_URL}/api/budget?month=${month}&year=${year}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return res.data;

    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(addBudget.pending, state => {
                state.loading = true;
                state.error = null
            })
            .addCase(addBudget.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getBudget.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.month = action.payload.month;
                state.year = action.payload.year;
                state.totalBudget = action.payload.totalBudget;
                state.totalSpent = action.payload.totalSpent;
                state.totalPercentUsed = action.payload.totalPercentUsed;
                state.categoryStats = action.payload.categoryStats;
            })
            .addCase(getBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.totalBudget = 0;
                state.totalSpent = 0;
                state.totalPercentUsed = 0;
                state.categoryStats = [];
            })
    }
})

export default budgetSlice.reducer;