import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ keyword = '', pageNumber = '', category = '', minPrice = '', maxPrice = '' } = {}, { rejectWithValue }) => {
        try {
            let url = `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`;
            if (category) url += `&category=${category}`;
            if (minPrice) url += `&minPrice=${minPrice}`;
            if (maxPrice) url += `&maxPrice=${maxPrice}`;

            const { data } = await api.get(url);
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

export const fetchProductDetails = createAsyncThunk(
    'products/fetchProductDetails',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/products/${id}`);
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

// Create Product Review
export const createProductReview = createAsyncThunk(
    'products/createProductReview',
    async ({ productId, review }, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await api.post(`/api/products/${productId}/reviews`, review, config);
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Update Product Review
export const updateProductReview = createAsyncThunk(
    'products/updateProductReview',
    async ({ productId, review }, { rejectWithValue, getState }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await api.put(`/api/products/${productId}/reviews`, review, config);
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchTopProducts = createAsyncThunk(
    'products/fetchTopProducts',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/products/top`);
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

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: {},
        topProducts: [],
        pages: 1,
        page: 1,
        loading: false,
        error: null,
        reviewSuccess: false,
        reviewError: null,
    },
    reducers: {
        resetReview: (state) => {
            state.reviewSuccess = false;
            state.reviewError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.pages = action.payload.pages;
                state.page = action.payload.page;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Review
            .addCase(createProductReview.pending, (state) => {
                state.reviewLoading = true;
                state.reviewError = null;
                state.reviewSuccess = false;
            })
            .addCase(createProductReview.fulfilled, (state) => {
                state.reviewLoading = false;
                state.reviewSuccess = true;
            })
            .addCase(createProductReview.rejected, (state, action) => {
                state.reviewLoading = false;
                state.reviewError = action.payload;
            })
            .addCase(fetchTopProducts.fulfilled, (state, action) => {
                state.topProducts = action.payload;
            });
    },
});

export const { resetReview } = productSlice.actions;

export default productSlice.reducer;
