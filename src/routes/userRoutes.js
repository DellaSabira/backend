const express = require('express');
const userAuthMiddleware = require('../middleware/userAuthMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

// Example routes
router.get('/users', userAuthMiddleware, userController.getAllUsers);
router.get('/:id', userAuthMiddleware, userController.getUserById);
router.put('/:id', userAuthMiddleware,  userController.updateUser);
router.delete('/:id', userAuthMiddleware, userController.deleteUser);

module.exports = router;
