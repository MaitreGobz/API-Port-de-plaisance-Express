const path = require('path');
const { expect } = require('chai');
const { makeLoggedAgent, expectStatus } = require(path.join(__dirname, 'helpers.js'));

describe('API Port Russell - 9 fonctionnalités (tests unitaires)', function () {
  let agent;

  before(async function () {
    ({ agent } = await makeLoggedAgent());
  });

  let catwayId;
  let reservationId;

  it('1) POST /catways -> crée un catway', async function () {
    const res = await agent
      .post('/catways')
      .send({ catwayNumber: 101, type: 'long', catwayState: 'neuf' });
    expectStatus(res, [200, 201]);
    expect(res.body).to.include({ catwayNumber: 101, type: 'long', catwayState: 'neuf' });
    expect(res.body).to.have.property('_id');
    catwayId = res.body._id;
  });

  it('2) GET /catways -> liste tous les catways', async function () {
    const res = await agent.get('/catways');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    const found = res.body.find(c => c._id === catwayId);
    expect(found).to.be.ok;
  });

  it('3) GET /catways/:id -> détails du catway', async function () {
    const res = await agent.get(`/catways/${catwayId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.include({ _id: catwayId, catwayNumber: 101 });
  });

  it('4) PATCH /catways/:id -> modifie la description de l’état', async function () {
    const res = await agent
      .patch(`/catways/${catwayId}`)
      .send({ catwayState: 'révisé' });
    expect(res.status).to.equal(200);
    expect(res.body).to.include({ _id: catwayId, catwayState: 'révisé' });
  });

  it('5) POST /catways/:id/reservations -> prend une réservation', async function () {
    const res = await agent
      .post(`/catways/${catwayId}/reservations`)
      .send({
        clientName: 'Jean Valjean',
        boatName: "L'Étoile",
        checkIn: '2025-01-01T10:00:00.000Z',
        checkOut: '2025-01-05T10:00:00.000Z'
      });
    expectStatus(res, [200, 201]);
    expect(res.body).to.include({ clientName: 'Jean Valjean', boatName: "L'Étoile" });
    reservationId = res.body._id;
    expect(reservationId).to.be.a('string');
  });

  it('6) GET /catways/reservations -> liste toutes les réservations', async function () {
    const res = await agent.get('/catways/reservations');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    const found = res.body.find(r => r._id === reservationId);
    expect(found).to.be.ok;
  });

  it('7) GET /catways/:id/reservations/:idReservation -> détails réservation', async function () {
    const res = await agent.get(`/catways/${catwayId}/reservations/${reservationId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.include({ _id: reservationId, boatName: "L'Étoile" });
  });

  it('8) DELETE /catways/:id/reservations/:idReservation -> supprime la réservation', async function () {
    const res = await agent.delete(`/catways/${catwayId}/reservations/${reservationId}`);
    expect(res.status).to.be.oneOf([200, 204]);
  });

  it('9) DELETE /catways/:id -> supprime le catway', async function () {
    const res = await agent.delete(`/catways/${catwayId}`);
    expect(res.status).to.be.oneOf([200, 204]);
    const notFound = await agent.get(`/catways/${catwayId}`);
    expect(notFound.status).to.be.oneOf([404, 410]); 
  });
});