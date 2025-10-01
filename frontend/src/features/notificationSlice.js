import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const initialState = {
    loading: false,
    notifications: [],
    error: null,
}

export const getNotifications = createAsyncThunk('notification/getNotification', async (__, { getState, rejectWithValue }) => {
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

export const markNotificationAsRead = createAsyncThunk('notificaiton/markNotificationAsRead', async (id, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;

        const res = await axios.patch(
            `${BACK_END_URL}/api/notification/${id}/read`,
            {},
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

export const deleteNotification = createAsyncThunk('notification/deleteNotification', async (id, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;

        const res = await axios.delete(
            `${BACK_END_URL}/${id}`,
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

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getNotifications.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const index = state.notifications.findIndex(notification => notification._id === action.payload._id);
                state.notifications[index] = updated;
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = state.notifications.filter(notification => notification.id !== action.payload.id);
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default notificationSlice.reducer;

