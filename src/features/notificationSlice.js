import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const getNotifications = createAsyncThunk('notification/getNotification', async (__, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        
        const res = await axios.get(
            `${BACK_END_URL}/api/notification/`,
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

const markNotificationAsRead = createAsyncThunk('notificaiton/markNotificationAsRead', async (id, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;

        const res = await axios.patch(
            `${BACK_END_URL}/api/notification/${id}/read`,
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

const deleteNotification = createAsyncThunk('notification/deleteNotification', async (id, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;

        const res = await axios.delete(
            `${BACK_END_URL}/id`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return res.data
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})