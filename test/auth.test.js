const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Auth', () => {
    const base = '/auth';
    const user = {
        name: 'Alice', 
        email:'alice@test.com', 
        password: 'secret1234'
    };

    it('POST /auth/register -> 201 (création)', async () => {
        const res = await request(app)
            .post(`${base}/register`)
            .send(user);
        expect(res.status).to.equal(201);
        expect(res.body).to.include.keys('id', 'name', 'email');
        expect(res.body).to.not.have.property('password');
    });

    it('POST /auth/register -> 409 (email déjà utilisé)', async () => {
        const res = await request(app)
            .post(`${base}/register`)
            .send(user);
        expect(res.status).to.equal(409);
    });

    it('POST /auth/login -> 200 (retourne un token)', async () => {
        const res = await request(app)
            .post(`${base}/login`)
            .send({email: user.email, password: user.password});
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token').that.is.a('sting');
    });

    it('POST /auth/login -> 401 (mauvais mot de passe)', async () => {
        const res = await request(app)
            .post(`${base}/login`)
            .send({email: user.email, password: 'wrong'});
        expect(res.status).to.equal(401);
    });
});