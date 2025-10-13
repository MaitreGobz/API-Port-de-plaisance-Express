const User = require('../models/User');
const bcrypt = require('bcryptjs');


// Create user, hash password, return user without password's field

async function createUser({ name, email, password}) {
    // Verify unicity of email
    const exist = await User.findOne({email});
    if (exist) throw Object.assign(new Error('Email déjà utilisée', {status: 409}));

    const hash =await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash});
    const object = user.toObject();
    delete object.password;
    return object;
};

// Update user

async function updateUser(id, payload) {
    if (payload.password) payload.password = await bcrypt.hash(payload.password, 10);
    const user = await User.findByIdAndUpdate(id, payload, {new: true});
    if(!user) throw Object.assign(new Error('Utilisateur non trouvé'), { status: 404 });
    const object = user.toObject();
    delete object.password;
    return object;
};

// Delete user

async function deleteUser(id) {
    const del = await User.findByIdAndDelete(id);
    if (!del) throw Object.assign(new Error('Utilisateur non trouvé'), { status:404});
}

module.exports = {
    createUser,
    updateUser,
    deleteUser
};