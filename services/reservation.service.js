const Reservation = require('../models/Reservation');


// List of reservation

async function listReservations() {
    const listItems = await Reservation.find().sort({catwayNumber: 1, checkIn: 1}).lean();
    return listItems;
};

// Details of reservation

async function getReservationById(idReservation) {
    const reservation = await Reservation.findById(idReservation).lean();
    if (!reservation) throw Object.assign(new Error('Réservation non trouvée'), {status: 404});
    return reservation;
}

// Create reservation with slot overlap control

async function createReservation(catwayId, { clientName, boatName, checkIn, checkOut}) {
    const cat = await Catway.findById(catwayId).lean();
    const overlap = await Reservation.findOne({
        catwayId,
        checkIn: {$lt: new Date(checkOut)},
        checkOut: {$gt: new Date(checkIn)},
    }).lean();
    if (overlap) throw Object.assign(new Error('Créneau déjà réservé sur ce catway'));
    const created = await Reservation.create({
        catwayId,
        catwayNumber: cat.catwayNumber,
        clientName,
        boatName,
        checkIn,
        checkOut,
    });
    return created.toObject();
};

// Delete Reservation

async function deleteReservation(idReservation) {
  const res = await Reservation.findByIdAndDelete(idReservation);
  if (!res) throw Object.assign(new Error('Réservation non trouvée'), { status: 404 });
}

module.exports = {
    listReservations,
    getReservationById,
    createReservation,
    deleteReservation,
};