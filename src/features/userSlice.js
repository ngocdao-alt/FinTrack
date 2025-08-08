import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const initialState = {
    loading: false,
    error: null,
    users:[],
    page: 1,
    totalPages: 1,
    totalUsers: 0
}

export const adminGetUsers = createAsyncThunk(
  "admin/user/adminGetUsers",
  async (filter, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    const { name, email, role, isBanned, limit = 20, page = 1} = filter;

    try {
      const res = await axios.get(`${BACK_END_URL}/api/admin/users/?name=${name}&email=${email}&role=${role}&isBanned=${isBanned}&limit=${limit}&page=${page}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const adminDeleteUser = createAsyncThunk("admin/user/adminDeleteUser", async (id, {getState, rejectWithValue}) => {
    const {token} = getState().auth;
    try {
        const res = await axios.delete(`${BACK_END_URL}/api/admin/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const adminUpdateUser = createAsyncThunk("admin/user/adminUpdateUser", async ({id, formData}, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
        try {
            const res = await axios.put(`${BACK_END_URL}/api/admin/users/${id}`, 
                formData, 
                {
                    headers: 
                        { 
                            Authorization: `Bearer ${token}` 
                        },
                }
        );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
})

export const adminBanUser = createAsyncThunk("admin/user/adminBanUser", async (id, {getState, rejectWithValue}) => {
    const {token} = getState().auth;
    try {
        const res = await axios.patch(`${BACK_END_URL}/api/admin/users/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
            }}
        )
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  clearError: (state) => {
    state.error = null;
  }
},
  extraReducers: (builder) => {
    builder
      .addCase(adminGetUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminGetUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(adminGetUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
            state.users[index] = action.payload; 
        }
       })
      .addCase(adminUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminDeleteUser.pending, (state, action) => {
        state.error = action.payload;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload.user._id;
        state.users = state.users.filter(item => item._id !== id);
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminBanUser.pending, (state, action) => {
        state.error = action.payload;
      })
      .addCase(adminBanUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload.user;
        const index = state.users.findIndex(item => item._id === user._id);
        if (index !== -1) {
            state.users[index] = user; 
        }
      })
      .addCase(adminBanUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
