import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const initialState = {
    loading: false,
    transactions: [],
    total: 0,
    page: 1,
    totalPage: 1,
    error: null
}

const getTransactions = createAsyncThunk('transaction/getTransactions', async (filter, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        const { type, category, keyword, month, year} = filter;

        const res = await axios.get(
            `${BACK_END_URL}/api/transaction?type=${type}&category=${category}&keyword=${keyword}&month=${month}&year=${year}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }, 
        );
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const createTransaction = createAsyncThunk('transaction/createTransaction', async (fields, { getState, rejectWithValue }) => {
    try {
        const { token }= getState().auth;
        const { type, amount, category, note, date, receiptImages, isRecurring } = fields;

        const formData = new FormData();
        formData.append("type", type);
        formData.append("amount", String(amount));
        formData.append("category", category);
        formData.append("note", note);
        formData.append("date", date);
        formData.append("isRecurring", isRecurring ? "true" : "false");

        receiptImages.forEach(file => {
            formData.append('receiptImages', file);
        });

        const res = await axios.post(
            `${BACK_END_URL}/api/transaction`, 
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            },    
        )

        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const updateTransaction = createAsyncThunk('transaction/updateTransaction', async ({ id ,fields } , { getState, rejectWithValue}) => {
    try {
        const { token }= getState().auth;
        const { type, amount, category, note, date, receiptImages, isRecurring } = fields;

        const formData = new FormData();
        formData.append("type", type);
        formData.append("amount", String(amount));
        formData.append("category", category);
        formData.append("note", note);
        formData.append("date", date);
        formData.append("isRecurring", isRecurring ? "true" : "false");

        receiptImages.forEach(file => {
            formData.append('receiptImages', file);
        });

        const res = await axios.put(
            `${BACK_END_URL}/api/transaction/${id}`, 
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            },    
        )

        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

const deleteTransaction = createAsyncThunk('transaction/deleteTransaction', async (id, { getState, rejectWithValue}) => {
    try {
        const { token } = getState().auth;
        await axios.delete(
            `${BACK_END_URL}/api/transaction/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }, 
        );

        return id;       
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getTransactions.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPage = action.payload.totalPage;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTransaction.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                if(state.page === state.totalPage){
                    state.transactions.push(action.payload);
                } 
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }) 
            .addCase(updateTransaction.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const index = state.transactions.findIndex(tx => tx._id === updated._id);
                if (index !== -1){
                    state.transactions[index] = updated;
                }
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })  
            .addCase(deleteTransaction.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = state.transactions.filter(tx => tx._id !== action.payload);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })  
    }
})

export default transactionSlice.reducer;