import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { logout } from './authSlice';

// Helper to save to backend
const saveCartToBackend = async (cartItems, getState) => {
    const { auth: { userInfo } } = getState();
    if (userInfo) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        // Sanitize items: Ensure qty exists (default to 1)
        const sanitizedItems = cartItems.map(item => ({
            ...item,
            qty: item.qty || 1,
            // Ensure product ID is set correctly
            product: item.product || item._id
        }));
        await api.put('/api/cart', { cartItems: sanitizedItems }, config);
    }
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await api.get('/api/cart', config);
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

const updateCart = (state) => {
    // Calculate items price
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );

    // Calculate shipping price (Free > 1000, else 100)
    state.shippingPrice = addDecimals(state.itemsPrice > 1000 ? 0 : 100);

    // Calculate tax price (15%)
    state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

    // Calculate total price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2);

    // Save to AsyncStorage
    AsyncStorage.setItem('cart', JSON.stringify(state));

    return state;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: 'PayPal',
    },
    reducers: {
        itemAdded: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            return updateCart(state);
        },
        itemRemoved: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            AsyncStorage.setItem('paymentMethod', JSON.stringify(action.payload));
        },
        clearCart: (state) => {
            state.cartItems = [];
            AsyncStorage.removeItem('cartItems');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state) => {
                state.cartItems = [];
                state.shippingAddress = {};
                state.paymentMethod = 'PayPal';
                state.itemsPrice = 0;
                state.shippingPrice = 0;
                state.taxPrice = 0;
                state.totalPrice = 0;
                AsyncStorage.removeItem('cart');
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cartItems = action.payload;
                return updateCart(state);
            });
    },
});

export const {
    itemAdded,
    itemRemoved,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
} = cartSlice.actions;

// Thunks
export const addToCart = (item) => async (dispatch, getState) => {
    dispatch(itemAdded(item));
    const { cart: { cartItems } } = getState();
    await saveCartToBackend(cartItems, getState);
};

export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch(itemRemoved(id));
    const { cart: { cartItems } } = getState();
    await saveCartToBackend(cartItems, getState);
};

export default cartSlice.reducer;
