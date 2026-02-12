const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();

        const orders = await Order.find({ isPaid: true });
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name');

        const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } })
            .sort({ countInStock: 1 })
            .limit(5);

        res.json({
            usersCount,
            productsCount,
            ordersCount,
            totalSales,
            recentOrders,
            lowStockProducts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
