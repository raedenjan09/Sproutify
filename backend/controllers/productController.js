const Product = require('../models/Product');

// @desc    Fetch all products with Search & Filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category && req.query.category !== 'All'
            ? { category: req.query.category }
            : {};

        const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
        const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};

        // Combine all filters
        const filter = {
            ...keyword,
            ...category,
            ...minPrice,
            ...maxPrice
        };
        // Verify price range if both exist to merge properly
        if (req.query.minPrice && req.query.maxPrice) {
            filter.price = { $gte: Number(req.query.minPrice), $lte: Number(req.query.maxPrice) };
        }

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: 'Sample name',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Sample brand',
            category: 'Sample category',
            countInStock: 0,
            numReviews: 0,
            description: 'Sample description',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
        isFeatured,
    } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.brand = brand;
            product.category = category;
            product.countInStock = countInStock;
            if (isFeatured !== undefined) product.isFeatured = isFeatured;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Product already reviewed');
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);

            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product review
// @route   PUT /api/products/:id/reviews
// @access  Private
const updateProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const reviewIndex = product.reviews.findIndex(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (reviewIndex === -1) {
                res.status(404);
                throw new Error('Review not found');
            }

            product.reviews[reviewIndex].rating = Number(rating);
            product.reviews[reviewIndex].comment = comment;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(200).json({ message: 'Review updated' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopProducts = async (req, res) => {
    try {
        // Fetch products that are featured, or top rated if none featured
        let products = await Product.find({ isFeatured: true }).limit(5);

        if (products.length === 0) {
            products = await Product.find({}).sort({ rating: -1 }).limit(5);
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    updateProductReview,
    getTopProducts,
};
