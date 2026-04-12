const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');
const { validateProductCreation, validateObjectIdParam } = require('../middleware/input-validation');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, JPG allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);
router.post('/', checkAuth, upload.single('productImage'), validateProductCreation, ProductsController.products_create_product);
router.get('/:productId', validateObjectIdParam('productId'), ProductsController.products_get_single_product);
router.patch('/:productId', checkAuth, validateObjectIdParam('productId'), ProductsController.products_update_product);
router.delete('/:productId', checkAuth, validateObjectIdParam('productId'), ProductsController.products_delete_product);

module.exports = router;