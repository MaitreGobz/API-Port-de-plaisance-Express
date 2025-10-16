const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/user.schema');
const ctrl = require('../controllers/auth.controller');

// Inscription
router.post('/register', validate(registerSchema), ctrl.register);

// Login
router.post('/login', validate(loginSchema), ctrl.login);

module.exports = router;