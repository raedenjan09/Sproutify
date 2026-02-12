const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        res.json(cart.cartItems);
    } else {
        res.json([]);
    }
});

// @desc    Update user cart
// @route   PUT /api/cart
// @access  Private
const updateUserCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = cartItems;
        const updatedCart = await cart.save();
        res.json(updatedCart.cartItems);
    } else {
        const newCart = await Cart.create({
            user: req.user._id,
            cartItems,
        });
        res.status(201).json(newCart.cartItems);
    }
});

module.exports = {
    getUserCart,
    updateUserCart,
};
