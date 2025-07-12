import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

export const getUsedCategories = createAsyncThunk('category/getUsedCategories', async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;

        const res = await axios.get(
            `${BACK_END_URL}/api/transaction/categories/used`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log(res);
        
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export default getUsedCategories;