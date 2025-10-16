const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Catways (CRUD, routes protégées)', () => {
  const base = '/catways';
  const authBase = '/auth';
  let token;
  let created;

  before(async () => {
    // Auth pour routes protégées
    await request(app).post(`${authBase}/register`).send({ name: 'Root', email: 'root@test.com', password: 'secret123' });
    const login = await request(app)
        .post(`${authBase}/login`)
        .send({ email: 'root@test.com', password: 'secret123' });
    token = login.body.token;
    });

    it('GET /catways -> 200 et renvoie un tableau', async () => {
        const res = await request(app)
            .get(base)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('POST /catways -> 201 (création)', async () => {
        const payload = { catwayNumber: 101, type: 'long', catwayState: 'bon état' };
        const res = await request(app)
            .post(base)
            .set('Authorization', `Bearer ${token}`)
            .send(payload);
        expect(res.status).to.equal(201);
        created = res.body;
        expect(created).to.include.keys('id', 'catwayNumber', 'type', 'catwayState');
    });

    it('GET /catways/:id -> 200 (détails)', async () => {
        const res = await request(app)
            .get(`${base}/${created.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
    });

    it('PATCH /catways/:id -> 200 (maj partielle)', async () => {
        const res = await request(app)
            .patch(`${base}/${created.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayState: 'maintenance' });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('catwayState', 'maintenance');
    });

    it('PUT /catways/:id -> 200 (remplacement complet)', async () => {
        const payload = { catwayNumber: 101, type: 'short', catwayState: 'occupied' };
        const res = await request(app)
            .put(`${base}/${created.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(payload);
        expect(res.status).to.equal(200);
        expect(res.body).to.include({ catwayNumber: 101, type: 'short', catwayState: 'occupied' });
    });

    it('DELETE /catways/:id -> 204 (suppression)', async () => {
        const res = await request(app)
            .delete(`${base}/${created.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(204);
    });
});
