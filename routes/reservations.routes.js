const express = require('express');
const router = express.Router({ mergeParams: true });
const { auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createReservationSchema, catwayIdParamSelect, reservationIdParam } = require('../validators/reservation.schema');
const reservationCtrl = require('../controllers/reservation.controller');

// Reservations's list
router.get('/reservations', auth, reservationCtrl.list);

// Create a reservation
router.post('/:id/reservations', auth, validate(catwayIdParamSelect, 'params'), validate(createReservationSchema), reservationCtrl.create);

// Reservation's details
router.get('/:id/reservations/:idReservation', auth, validate(catwayIdParamSelect, 'params'), validate(reservationIdParam, 'params'), reservationCtrl.details);

// Delete a reservation
router.delete('/:id/reservations/:idReservation', auth, validate(catwayIdParamSelect, 'params'), validate(reservationIdParam, 'params'), reservationCtrl.remove);

module.exports = router;