const userService = require('../services/user.service');

// Create a user
async function create(req, res, next) {
    try{
        const user = await userService.createUser(req.body);
        res.redirect('/dashboard');
        res.status(201).json(user);
    } catch(error) {
        next(error); 
    }
};

// Update a user
async function update(req, res, next) {
    try {
        const updated = await userService.updateUser(req.params.id, req.body);
        res.redirect('/dashboard');
        res.status(200).json(updated);
    } catch(error) {
        next(error);
    }
};

// Delete a user
async function remove(req, res, next) {
    try {
        await userService.deleteUser(req.params.id);
        res.redirect('/dashboard');
        return res.status(204).send();
    } catch(error) {
        next(error);
    }
};

module.exports = {
    create,
    update,
    remove
};