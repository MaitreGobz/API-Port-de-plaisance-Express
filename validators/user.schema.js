const Joi = require('joi');

// Inscription
const registerSchema = Joi.object({
    name: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(30).required(),
});

// Login
const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
});

// Update user
const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(3).max(30),
    email: Joi.string().trim().email(),
    password: Joi.string().min(6).max(30),
}).min(1);

// :id in params (ObjectId Mongo)
const userIdParam = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateUserSchema,
    userIdParam,
};