const catwayService = require('../services/reservation.service');


// List all reservation
async function list(req, res, next) {
    try {
        const reservations = await catwayService.listReservation(req.query);
        res.json(reservations);
    } catch(error) {
        next(error); 
    }
};

// Get the details of a reservation from its ID
async function details(req, res, next) {
    try {
        const reservation = await catwayService.getReservationById(req.params.idReservation);
        res.json(reservation);
    } catch(error) {
        next(error); 
    }
};

// Create a reservation
async function create(req, res, next) {
    try {
        const newReservation = await catwayService.createReservation(req.params.id, req.body);
        res.status(201).json(newReservation);
    } catch(error) {
        next(error); 
    }
};

// Delete a reservation
async function remove(req, res, next) {
    try {
        await catwayService.deleteReservation(req.params.idReservation);
        res.status(204).send();
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