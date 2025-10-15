const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

function datePlus(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}


describe('Reservations (sous-ressource Catways)', () => {
    const authBase = '/api/auth';
    const catwaysBase = '/api/catways';

    let token;
    let catwayId;
    let reservationId;

    before(async () => {
        // Auth pour routes protégées
        await request(app)
            .post(`${authBase}/register`)
            .send({ name: 'Ella', email: 'ella@test.com', password: 'secret1234' });
        const login = await request(app)
            .post(`${authBase}/login`)
            .send({ email: 'ella@test.com', password: 'secret1234' });
        token = login.body.token;

        // Créer un catway pour les tests de réservation
        const catRes = await request(app)
            .post(`${catwaysBase}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 202, type: 'long', catwayState: 'bon état' });
        expect(catRes.status).to.equal(201);
        catwayId = catRes.body.id;
    });

    it('GET /catways/:id/reservations -> 200 (liste globale des réservations)', async () => {
        const res = await request(app)
            .get(`${catwaysBase}/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('POST /catways/:id/reservations -> 201 (création)', async () => {
        const payload = {
            clientName: 'Mathias',
            boatName: 'La justice du lion',
            checkIn: datePlus(1),
            checkOut: datePlus(3)
        };
        const res = await request(app)
            .post(`${catwaysBase}/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`)
            .send(payload);
        expect(res.status).to.equal(201);
        reservationId = res.body.id;
        expect(res.body).to.include.keys('id', 'clientName', 'boatName', 'checkIn', 'checkOut');
    });

    it('POST /catways/:id/reservations -> 409 (chevauchement)', async () => {
        const overlap = {
            clientName: 'Lola',
            boatName: 'La beauté circassienne',
            checkIn: datePlus(2),
            checkOut: datePlus(4)
        };
        const res = await request(app)
            .post(`${catwaysBase}/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`)
            .send(overlap);
        expect(409).to.include(res.status);
    });

    it('GET /catways/:id/reservations/{idReservation} -> 200 (détails)', async () => {
        const res = await request(app)
            .get(`${catwaysBase}/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', reservationId);
    });

    it('DELETE /catways/:id/reservations/{idReservation} -> 204 (suppression)', async () => {
        const res = await request(app)
            .delete(`${catwaysBase}/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(204);
    });
});
