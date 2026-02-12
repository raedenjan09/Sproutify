import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: 'PayPal',
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            AsyncStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
            AsyncStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            AsyncStorage.setItem('shippingAddress', JSON.stringify(action.payload));
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
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
