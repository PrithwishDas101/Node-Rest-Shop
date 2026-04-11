const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UsersController.users_create_user);
router.post('/login', UsersController.users_login_user);
router.get('/me', checkAuth, UsersController.users_get_profile);
router.delete('/:userId', checkAuth, UsersController.users_delete_user);

module.exports = router;