const { expect } = require('chai');

function expectStatus(res, allowedStatuses) {
  if (!allowedStatuses.includes(res.status)) {
    throw new Error(`HTTP ${res.status} reçu, attendu parmi: ${allowedStatuses.join(', ')}`);
  }
}

// Create an agent and perform register + login.
async function makeLoggedAgent({
  name = 'Test User',
  email = 'user@test.dev',
  password = 'secret123'
} = {}) {
  const agent = request.agent(app);

  // REGISTER
  const request1 = await agent
    .post('/auth/register')
    .type('form')
    .send({ name, email, password });
  expectStatus(request1, [200, 201, 302]);

  // LOGIN
  const request2 = await agent
    .post('/auth/login')
    .type('form')
    .send({ email, password });
  expectStatus(request2, [200, 201, 302]);

  return { agent };
}

module.exports = { makeLoggedAgent, expectStatus };