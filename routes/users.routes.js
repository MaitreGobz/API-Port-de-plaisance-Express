const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { cookieAuth } = require('../middlewares/cookieAuth');
const { validate } = require('../middlewares/validate');
const { registerSchema, updateUserSchema, userIdParam } = require('../validators/user.schema');
const userCtrl = require('../controllers/user.controller');

const requireAuth = [cookieAuth, auth]

// Create a user
router.post('/', requireAuth, validate(registerSchema, 'body'), userCtrl.create);

// Update a user
router.patch('/:id', requireAuth, validate(userIdParam, 'params'), validate(updateUserSchema, 'body'), userCtrl.update);

// Delete a user
router.delete('/:id', requireAuth, validate(userIdParam, 'params'), userCtrl.remove);

module.exports = router;