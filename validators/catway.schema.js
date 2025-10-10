const Joi = require('joi');

// Create a catway
const createCatwaySchema = Joi.object({
    catwayNumber: Joi.number().integer().min(1).required(),
    type: Joi.string().valid('long', 'short'),
    catwayState: Joi.string().trim(),
});

// Update catway
const updateCatwaySchema = Joi.object({
    catwayNumber: Joi.number().integer().min(1),
    type: Joi.string().valid('long', 'short'),
    catwayState: Joi.string().trim(),
}).min(1);

// :id in params (ObjectId Mongo)
const catwayIdParam = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

module.exports = {
    createCatwaySchema,
    updateCatwaySchema,
    catwayIdParam,
};