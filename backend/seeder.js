const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Fix relative paths - we are in backend/seeder.js, data is in backend/data
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const startSeeder = async () => {
    try {
        await connectDB();

        if (process.argv[2] === '-d') {
            await destroyData();
        } else {
            await importData();
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startSeeder();
