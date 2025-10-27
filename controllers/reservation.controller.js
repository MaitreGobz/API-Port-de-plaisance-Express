const reservationService = require('../services/reservation.service');


// List all reservation
async function list(req, res, next) {
    try {
        const reservations = await reservationService.listReservations(req.query);
        return res.status(200).json(reservations);
    } catch (error) {
        next(error); 
    }
};

// Get the details of a reservation from its ID and catway ID
async function details(req, res, next) {
  try {
    const { idReservation } = req.params;
    const doc = await reservationService.getReservationById(idReservation);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(doc);
  } catch (err) { 
    next(err); 
    }
};

// Create a reservation
async function create(req, res, next) {
    try {
        const newReservation = await reservationService.createReservation(req.params.id, req.body);
        res.status(201).json(newReservation);
    } catch(error) {
        next(error); 
    }
};

// Delete a reservation
async function remove(req, res, next) {
    try {
        await reservationService.deleteReservation(req.params.idReservation);
        res.status(204).json();
    } catch(error) {
        next(error); 
    }
};

module.exports = {
    list,
    details,
    create,
    remove
};