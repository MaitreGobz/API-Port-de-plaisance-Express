// config/db.js
const mongoose = require('mongoose');

let connectingPromise = null;

/** Connexion générique (utilisée par initClientDbConnection et en prod) */
async function connect(uri) {
  const url =
    uri ||
    process.env.URL_MONGO ||
    'mongodb://127.0.0.1:27017/port_russell';

  const options = {
    dbName: process.env.MONGO_DBNAME || undefined,
  };

  // Déjà connecté ?
  if (mongoose.connection.readyState === 1) return mongoose;
  // Connexion en cours ?
  if (connectingPromise) return connectingPromise;

  connectingPromise = mongoose
    .connect(url, options)
    .then(() => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Connection à MongoDB réussie`);
      }
      return mongoose;
    })
    .catch((err) => {
      console.error('Connection à MongoDB échouée', err.message);
      throw err;
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
}

/** Alias gardant le nom attendu par app.js */
async function initClientDbConnection(uri) {
  return connect(uri);
}

/** Fermeture propre (utile en teardown) */
async function closeClientDbConnection() {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      if (process.env.NODE_ENV !== 'test') {
        console.log('Déconnecté de la base de donnée');
      }
    } catch (_) {}
  }
}

module.exports = {
  mongoose,
  connect,
  initClientDbConnection,
  closeClientDbConnection,
};