const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createCatwaySchema, updateCatwaySchema, catwayIdParam} = require('../validators/catway.schema');
const catwayCtrl = require('../controllers/catway.controller');

// Catways's list
router.get('/catways', auth, catwayCtrl.list);

// Create a catway
router.post('/catways', auth, validate(createCatwaySchema), catwayCtrl.create);

// Catway's details
router.get('/catways/:id', auth, validate(catwayIdParam, 'params'), catwayCtrl.details);

// Update partially a catway
router.patch('/catways/:id', auth, validate(catwayIdParam, 'params'), validate(updateCatwaySchema), catwayCtrl.patch);

// Replace a catway
router.put('/catways/:id', auth, validate(catwayIdParam, 'params'), validate(updateCatwaySchema), catwayCtrl.replace);

// Delete a catway
router.delete('/catways/:id', auth, validate(catwayIdParam, 'params'), catwayCtrl.remove);

module.exports = router;