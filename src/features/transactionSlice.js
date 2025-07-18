import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const initialState = {
    loading: false,
    transactions: [],
    total: 0,
    page: 1,
    totalPages: 1,
    shouldRefetch: false,
    error: null
}

export const getTransactions = createAsyncThunk('transaction/getTransactions', async (filter, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        const { type, category, keyword, specificDate='', month, year, page = 1} = filter;

        const res = await axios.get(
            `${BACK_END_URL}/api/transaction?type=${type}&category=${category}&keyword=${keyword}&specificDate=${specificDate}&month=${month}&year=${year}&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }, 
        );
        console.log(res.data);
        
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getTransactionsByMonth = createAsyncThunk('transaction/getTransactionsByMonth', async (date, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
        const {month, year} = date;

        const res = await axios.get(
            `${BACK_END_URL}/api/transactions/by-month?month=${month}&year=${year}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }, 
        );
        console.log(res.data);
        
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createTransaction = createAsyncThunk('transaction/createTransaction', async (fields, { getState, rejectWithValue }) => {
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

        return res.data.transaction
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateTransaction = createAsyncThunk('transaction/updateTransaction', async ({ id ,fields } , { getState, rejectWithValue}) => {
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

export const deleteTransaction = createAsyncThunk('transaction/deleteTransaction', async (id, { getState, rejectWithValue}) => {
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
    reducers: {
        setShouldRefetch: (state) => {
            state.shouldRefetch = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getTransactions.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                
                state.loading = false;

                const { data, total, page, totalPages } = action.payload;

                console.log(page);
                

                if (page === 1) {
                    state.transactions = data;
                } else {
                    state.transactions = [...state.transactions, ...data];
                }

                state.total = total;
                state.page = page || 1;
                state.totalPages = totalPages;
                state.error = null;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getTransactionsByMonth.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactionsByMonth.fulfilled, (state, action) => {   
                state.loading = false;
                const { data, total, page, totalPages } = action.payload;
                state.transactions = data;
                state.total = total;
                state.page = page || 1;
                state.totalPages = totalPages;
                state.error = null;
            })
            .addCase(getTransactionsByMonth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTransaction.pending, state => {
                state.loading = true;
                state.error = null;
            })
           .addCase(createTransaction.fulfilled, (state, action) => {
                const newTx = action.payload;
                const txs = state.transactions;

                state.loading = false;

                if (!txs.length) return;

                const newDate = new Date(newTx.date).getTime();
                const firstDate = new Date(txs[0].date).getTime();
                const lastDate = new Date(txs[txs.length - 1].date).getTime();

                if (newDate > firstDate) {
                    txs.unshift(newTx);
                    if (txs.length > 10) txs.pop(); 
                }
                else if (newDate <= firstDate && newDate >= lastDate) {
                    state.shouldRefetch = true;
                }
                // Nếu không liên quan gì tới range hiện tại -> bỏ qua
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

export const { setShouldRefetch } = transactionSlice.actions;
export default transactionSlice.reducer;