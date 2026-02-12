import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Create Order
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (order, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.post('/api/orders', order, config);
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

// Get Order Details
export const getOrderDetails = createAsyncThunk(
    'orders/getOrderDetails',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.get(`/api/orders/${id}`, config);
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

// Pay Order (Mock)
export const payOrder = createAsyncThunk(
    'orders/payOrder',
    async ({ orderId, paymentResult }, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.put(`/api/orders/${orderId}/pay`, paymentResult, config);
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

// List My Orders
export const listMyOrders = createAsyncThunk(
    'orders/listMyOrders',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.get('/api/orders/myorders', config);
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

// Cancel Order
export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.put(`/api/orders/${id}/cancel`, {}, config);
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

// Update Order to Delivered
export const updateOrderToDelivered = createAsyncThunk(
    'orders/updateOrderToDelivered',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.put(`/api/orders/${id}/deliver`, {}, config);
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

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        loading: false,
        success: false,
        order: null,
        orders: [], // For order history
        error: null,
        loadingPay: false,
        successPay: false,
        loadingDeliver: false,
        successDeliver: false,
    },
    reducers: {
        resetOrder: (state) => {
            state.loading = false;
            state.success = false;
            state.order = null;
            state.error = null;
            state.loadingPay = false; // Reset pay state
            state.successPay = false;
            state.loadingDeliver = false; // Reset deliver state
            state.successDeliver = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Order Details
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // List My Orders
            .addCase(listMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(listMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(listMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cancel Order
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload; // Update current order view
                // Optionally update the list if needed
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Pay Order
            .addCase(payOrder.pending, (state) => {
                state.loadingPay = true;
            })
            .addCase(payOrder.fulfilled, (state) => {
                state.loadingPay = false;
                state.successPay = true;
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.loadingPay = false;
                state.error = action.payload;
            })
            // Deliver Order
            .addCase(updateOrderToDelivered.pending, (state) => {
                state.loadingDeliver = true;
            })
            .addCase(updateOrderToDelivered.fulfilled, (state) => {
                state.loadingDeliver = false;
                state.successDeliver = true;
            })
            .addCase(updateOrderToDelivered.rejected, (state, action) => {
                state.loadingDeliver = false;
                state.error = action.payload;
            });
    },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
