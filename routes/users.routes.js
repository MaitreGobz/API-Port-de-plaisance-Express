const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { registerSchema, updateUserSchema, userIdParam } = require('../validators/user.schema');
const userCtrl = require('../controllers/user.controller');

// Create a user
router.post('/users', auth, validate(registerSchema, 'body'), userCtrl.create);

// Update a user
router.patch('/users/:id', auth, validate(userIdParam, 'params'), validate(updateUserSchema, 'body'), userCtrl.update);

// Delete a user
router.delete('/users/:id', auth, validate(userIdParam, 'params'), userCtrl.remove);

module.exports = router;