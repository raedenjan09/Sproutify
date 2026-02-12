const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');

router.post('/', upload.single('image'), (req, res) => {
    res.send(req.file.path);
});

module.exports = router;
