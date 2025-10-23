const catwayService = require('../services/catway.service');


// List all catways
async function list(req, res, next) {
    try {
        const catways = await catwayService.listCatways(req.query);
        res.json(catways);
    } catch (error) {
        next(error); 
    }
};

// Get the details of a catway from its ID
async function details(req, res, next) {
    try {
        const catway = await catwayService.getCatwayById(req.params.id);
        res.json(catway);
    } catch (error) {
        next(error); 
    }
};

// Create a new catway
async function create(req, res, next) {
    try {
        const newCatway = await catwayService.createCatway(req.body);
        res.redirect('/catways');
        res.status(201).json(newCatway)
    } catch(error) {
        next(error); 
    }
};

// Completely replace an existing catway (PUT method)
async function replace(req, res, next) {
    try {
        const updatedCatway = await catwayService.replaceCatway(req.params.id, req.body);
        res.redirect('/catways');
        res.status(200).json(updatedCatway);
    } catch(error) {
        next(error); 
    }
};

// Partially modify a catway (PATCH method)
async function patch(req, res, next) {
    try {
        const patchedCatway = await catwayService.updateCatway(req.params.id, req.body);
        res.redirect('/catways');
        res.status(200).json(patchedCatway); 
    } catch(error) {
        next(error); 
    }
};

// Delete a catway
async function remove(req, res, next) {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.redirect('/catways');
        res.status(204).send();
    } catch(error) {
        next(error); 
    }
};

module.exports = {
    list,
    details,
    create,
    replace,
    patch,
    remove
};