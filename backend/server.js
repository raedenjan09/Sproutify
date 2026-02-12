const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');

const productRoutes = require('./routes/productRoutes');

const orderRoutes = require('./routes/orderRoutes');

const uploadRoutes = require('./routes/uploadRoutes');

const adminRoutes = require('./routes/adminRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
    res.send('Sproutify Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
