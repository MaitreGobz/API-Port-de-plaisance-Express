// scripts/seedData.js
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Catway from '../models/Catway.js';
import Reservation from '../models/Reservation.js';

dotenv.config();

const __dirname = path.resolve();

async function seedData() {
  try {
    await mongoose.connect(process.env.URL_MONGO);
    console.log('Connecté à MongoDB');

    // Import JSON file
    const catwaysPath = path.join(__dirname, 'data', 'catways.json');
    const reservationsPath = path.join(__dirname, 'data', 'reservations.json');

    const catways = JSON.parse(fs.readFileSync(catwaysPath, 'utf8'));
    const reservationsRaw = JSON.parse(fs.readFileSync(reservationsPath, 'utf8'));

    // Empty the collections
    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Collections catways et reservations vidées');

    // Insert catways
    const insertedCatways = await Catway.insertMany(catways);
    console.log(`${insertedCatways.length} catways insérés`);

    // Associate catwayNumber → _id
    const numberToId = new Map();
    for (const c of insertedCatways) {
      numberToId.set(c.catwayNumber, c._id);
    }

    // Prepare reservations
    const reservations = reservationsRaw.map(r => {
      const catwayId = numberToId.get(r.catwayNumber);
      if (!catwayId) throw new Error(`Aucun catwayId pour catwayNumber ${r.catwayNumber}`);
      return {
        catwayId,
        catwayNumber: r.catwayNumber,
        clientName: r.clientName,
        boatName: r.boatName,
        checkIn: new Date(r.checkIn),
        checkOut: new Date(r.checkOut),
      };
    });

    // Insert reservations
    await Reservation.insertMany(reservations);
    console.log(`${reservations.length} réservations insérées`);

    console.log('Importation terminée avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('Erreur durant le seed :', err);
    process.exit(1);
  }
}

seedData();
