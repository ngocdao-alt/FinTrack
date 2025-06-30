import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const initialState = {
    loading: false,
    month: null,
    year: null,
    amount: 0,
    spent: 0,
    percentUsed: 0,
    error: null,
}

const addBudget = createAsyncThunk('budget/addBudget', async (fields, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const { month, year, amount } = fields;

        const res = await axios.post(
            `${BACK_END_URL}/api/budget`,
            {
                month,
                year,
                amount
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

const getBudget = createAsyncThunk('budget/getBudget', async (fields, { getState, rejectWithValue }) => {
    try {
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
                state.amount = action.payload.amount;
                state.spent = action.payload.spent;
                state.percentUsed = action.payload.percentUsed;
            })
            .addCase(getBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default budgetSlice.reducer;