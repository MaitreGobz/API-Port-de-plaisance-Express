const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createCatwaySchema, catwayIdParam, patchCatwaySchema, putCatwaySchema} = require('../validators/catway.schema');
const catwayCtrl = require('../controllers/catway.controller');

// Catways's list
router.get('/', auth, catwayCtrl.list);

// Create a catway
router.post('/', auth, validate(createCatwaySchema), catwayCtrl.create);

// Catway's details
router.get('/:id', auth, validate(catwayIdParam, 'params'), catwayCtrl.details);

// Update partially a catway
router.patch('/:id', auth, validate(catwayIdParam, 'params'), validate(patchCatwaySchema), catwayCtrl.patch);

// Replace a catway
router.put('/:id', auth, validate(catwayIdParam, 'params'), validate(putCatwaySchema), catwayCtrl.replace);

// Delete a catway
router.delete('/:id', auth, validate(catwayIdParam, 'params'), catwayCtrl.remove);

module.exports = router;