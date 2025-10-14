const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const userService = require('../services/user.service');


// Controller to registration
async function register(req, res, next) {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch(error) {
        next(error); 
    }
};

// Controller to login
async function login(req, res, next) {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({error: "Informations d'identification non valides"});
        
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {expiredIn: '4h'});
        res.json({token});
    } catch(error) {
        next(error); 
    }
};

module.exports = {
    register,
    login
};