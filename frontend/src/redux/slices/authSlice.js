import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/users/login', { email, password });
            await AsyncStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/users', { name, email, password });
            await AsyncStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await AsyncStorage.removeItem('userInfo');
});

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (user, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.put('/api/users/profile', user, config);
            await AsyncStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: null,
        loading: false,
        error: null,
        success: false, // For update profile success
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        resetAuthSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.userInfo = null;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.success = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setUserInfo, resetAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
