const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Users (routes protégés)', () => {
    const authBase = '/auth';
    let token;
    let createdUser;

    before(async () => {
        await request(app).post(`${authBase}/register`).send({name: 'Admintest', email: 'admin@test.com', password: 'secret1234'});
        const login = await request(app)
            .post(`${authBase}/login`)
            .send({email: 'admin@test.com', password: 'secret1234'});
        token = login.body.token;
    });

    it('POST /users -> 201 (création)', async () => {
        const res = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({name: 'Léon', email: 'leon@test.com', password: 'secret1234'});
        expect(res.status).to.equal(201);
        createdUser = res.body;
        expect(createdUser).to.include.keys('id', 'name', 'email');
    });

    it('PATCH /users/:id -> 200 (maj partielle)', async () => {
        const res = await request(app)
            .patch(`/users/${createdUser.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Bobby' });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('name', 'Bobby');
    });

    it('DELETE /users/:id -> 204 (suppression)', async () => {
        const res = await request(app)
            .delete(`/users/${createdUser.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(204);
    });

    it('DELETE /users/:id -> 404 (déjà supprimé)', async () => {
        const res = await request(app)
        .delete(`/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${token}`);
        expect(404).to.include(res.status);
    });
});