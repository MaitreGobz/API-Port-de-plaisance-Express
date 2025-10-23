const Joi = require('joi');

// Check that the checkin date is before than the checkout date
const checkInBeforeOut = (value, helpers) => {
    const {checkIn, checkOut} = value;
    if (new Date(checkIn) >= new Date(checkOut)) {
        return helpers.error('date.order');
    }
    return value;
};

// Create reservation
const createReservationSchema = Joi.object({
    clientName: Joi.string().trim().min(2).required(),
    boatName: Joi.string().trim().min(2).required(),
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().required(),
}).custom(checkInBeforeOut, 'vérifier les dates').message({
    'date.order': 'La date de checkIn doit être antérieur à checkOut',
});

const catwayIdParamSelect = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const reservationIdParam = Joi.object({
    idReservation: Joi.string().hex().length(24).required(),
});

const bothIdParams = Joi.object({
    id: Joi.string().hex().length(24).required(),
    idReservation: Joi.string().hex().length(24).required(),
});

module.exports = {
    createReservationSchema,
    catwayIdParamSelect,
    reservationIdParam,
    bothIdParams
};