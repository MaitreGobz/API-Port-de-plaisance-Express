const mongoose = require('mongoose');

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO);
        console.log('Connection à MongoDb réussie');
    } catch (error) {
        console.log('Erreur de connexion à MongoDb', error.message);
        throw error;
    }
};