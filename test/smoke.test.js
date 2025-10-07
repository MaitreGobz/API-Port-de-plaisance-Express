const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Smoke tests', function () {
    it('GET/ doit répondre 200', async function () {
        const res = await request(app).get('/').expect(200);
    });
    it('GET /__unknown doit répondre 400', async function () {
        const res = await request(app).get('/__unknown').expect(404);
    });
});