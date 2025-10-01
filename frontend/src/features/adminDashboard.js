import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const initialState = {
    loading: false,
    error: null,
    userCount: 0,
    transactionCount: 0,
    totalIncome: 0,
    totalExpense: 0,
    monthlyStats: [],
    monthlyTransactions: [],
}

export const adminGetDashboard = createAsyncThunk('admin/dashboard/adminGetDashboard', async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const res = await axios.get(
            `${BACK_END_URL}/api/admin/dashboard`,
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
});

export const adminGetMonthlyIncomeExpenseStat = createAsyncThunk('admin/dashboard/adminGetMonthlyIncomeExpenseStat', async (year, { getState, rejectWithValue}) => {
    try {
        const { token } = getState().auth;
        const res = await axios.get(`${BACK_END_URL}/api/admin/dashboard/monthly-stats?year=${year}`,
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

export const adminGetMonthlyTransactions = createAsyncThunk('admin/dashboard/adminGetMonthlyTransactions', async (year, { getState, rejectWithValue}) => {
    try {
        const { token } = getState().auth;
        const res = await axios.get(`${BACK_END_URL}/api/admin/dashboard/monthly-transactions?year=${year}`,
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

const adminDashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder 
            .addCase(adminGetDashboard.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.userCount = action.payload.userCount;
                state.totalIncome = action.payload.totalIncome;
                state.totalExpense = action.payload.totalExpense;
                state.transactionCount = action.payload.transactionCount;
            })
            .addCase(adminGetDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(adminGetMonthlyIncomeExpenseStat.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetMonthlyIncomeExpenseStat.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyStats = action.payload;
            })
            .addCase(adminGetMonthlyIncomeExpenseStat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(adminGetMonthlyTransactions.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetMonthlyTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyTransactions = action.payload;
            })
            .addCase(adminGetMonthlyTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default adminDashboardSlice.reducer;