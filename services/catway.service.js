const Catway = require('../models/Catway');


// List of catways ordered by id

async function listCatways() {
  const listItems = await Catway.find().sort('catwayNumber').lean();
  return listItems;
};

// Create a catway

async function createCatway({ catwayNumber, type, catwayState }) {
    const exist = await Catway.findOne({ catwayNumber });
    if (exist) throw Object.assign(new Error('Le numéro de catway est déjà utilisé'));
    const newCatway = await Catway.create({ catwayNumber, type, catwayState });
    return newCatway.toObject();
};

// Update partially catway

async function updateCatway (id, payload) {
    // Verify unicity of catwayNumber
    if (payload?.catwayNumber != null) {
        const check = await Catway.findOne({ catwayNumber: payload.catwayNumber, _id: {$ne: id} }).lean();
        if (check) throw Object.assign(new Error('Le numéro de catway est déjà utilisé'));
    }

    const catway = await Catway.findByIdAndUpdate(id, payload, {new: true, runValidators: true});
    if (!catway) throw Object.assign(new Error('Catway non trouvé'), {status: 404});
    return catway.toObject();
};

// Update completelly catway

async function replaceCatway(id, {catwayNumber, type, catwayState }) {
    // All fields are required
    if (catwayNumber == null || type == null || catwayState == null) 
        throw Object.assign(new Error('Tous les champs sont requis'));

    // Verify unicity of catwayNumber
    const check = await Catway.findOne({ catwayNumber, _id: {$ne: id} }).lean();
    if (check) throw Object.assign(new Error('Le numéro de catway est déjà utilisé'));
    
    const catway = await Catway.findByIdAndUpdate(id, { catwayNumber, type, catwayState }, {new: true, runValidators: true, overwrite: true});
    if (!catway) throw Object.assign(new Error('Catway non trouvé'), {status: 404});
    return catway.toObject();
};

// Delete catway

async function deleteCatway(id) {
    const del = await Catway.findByIdAndDelete(id);
    if (!del) throw Object.assign(new Error('Catway non trouvé'), {status:404});
};

// Details of catway

async function getCatwayById(id) {
    const catway = await Catway.findById(id).lean();
    if (!catway) throw Object.assign(new Error('Catway non trouvé'), {status: 404});
    return catway;
};

module.exports = {
    listCatways,
    createCatway,
    updateCatway,
    replaceCatway,
    deleteCatway,
    getCatwayById
};