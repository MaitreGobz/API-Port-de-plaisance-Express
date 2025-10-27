// test/setup.js
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongo;

before(async function () {
    this.timeout(60000);
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    // IMPORTANT: forcer l'URL avant de charger l'app
    process.env.URL_MONGO = uri;

    // connexion mongoose
    await mongoose.connect(uri, { dbName: 'testdb' });

    // charger l’Express app après définition de URL_MONGO
    global.app = require('../app');         // ton app Express (module.exports = app)
    global.request = require('supertest');  // supertest
});

before(async function () {
    this.timeout(30000);
    const { collections } = mongoose.connection;
    for (const key of Object.keys(collections)) {
    try { await collections[key].deleteMany({}); } catch {}
  }
});

after(async function () {
    this.timeout(30000);
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
});