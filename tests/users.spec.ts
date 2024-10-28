import request from 'supertest';
import { v4 as uuid } from 'uuid';

import { createServer } from '../src/server';
import { UserPayload } from '../src/types';
import { isValidUUID } from '../src/utils';
import { messages } from '../src/messages';

jest.mock('../src/models', () => ({ UsersModel: new Map() }));

describe('/api/users', () => {
  const newUser: UserPayload = {
    username: 'Nikolay',
    age: 26,
    hobbies: ['padel', 'soccer', 'poker'],
  };
  const userToUpdate: UserPayload = {
    username: 'Joao',
    age: 53,
    hobbies: ['bird watching', 'hiking', 'reading'],
  };

  let server: ReturnType<typeof createServer>;

  beforeEach(() => {
    server = createServer();
  });

  afterEach(() => {
    server.close();
  });

  it('scenario #1', async () => {
    let createdUserID = '';

    // Get all users
    await request(server)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200, []);

    // Create a new user
    await request(server)
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({ ...newUser, id: expect.any(String) });
        expect(isValidUUID(res.body.id)).toBe(true);
        createdUserID = res.body.id;
      });

    // Try to receive the created user by id
    await request(server)
      .get(`/api/users/${createdUserID}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ ...newUser, id: expect.any(String) });
        expect(isValidUUID(res.body.id)).toBe(true);
      });

    // Try to update the created user
    await request(server)
      .put(`/api/users/${createdUserID}`)
      .send({ ...userToUpdate, id: createdUserID })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ ...userToUpdate, id: expect.any(String) });
        expect(isValidUUID(res.body.id)).toBe(true);
      });

    // Try to delete the created user
    await request(server).delete(`/api/users/${createdUserID}`).expect(204, '');

    // Try to receive the deleted user
    await request(server)
      .get(`/api/users/${createdUserID}`)
      .expect('Content-Type', /json/)
      .expect(404, { code: 404, message: messages.userNotFound });
  });

  it('scenario #2', async () => {
    const invalidUserId = 'invalid-uuid';

    // Try to get a user with an invalid ID format
    await request(server)
      .get(`/api/users/${invalidUserId}`)
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: messages.invalidUserID,
      });

    // Try to update a user with an invalid ID format
    await request(server)
      .put(`/api/users/${invalidUserId}`)
      .send({ username: 'Invalid User', age: 30, hobbies: [] })
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: messages.invalidUserID,
      });

    // Try to delete a user with an invalid ID format
    await request(server)
      .delete(`/api/users/${invalidUserId}`)
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: messages.invalidUserID,
      });

    // Check that no user was created or deleted with invalid ID
    await request(server)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200, []);
  });

  it('scenario #3', async () => {
    const invalidUser: Partial<UserPayload> = {
      age: 25,
      hobbies: ['chess'],
    };

    // Try to create a user with missing fields
    await request(server)
      .post('/api/users')
      .send(invalidUser)
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: messages.invalidPayloadFields,
      });

    // Try to create a user without a payload
    await request(server)
      .post('/api/users')
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: messages.invalidPayload,
      });

    // Try to update a not existing user
    await request(server)
      .put(`/api/users/${uuid()}/`)
      .send(invalidUser)
      .expect('Content-Type', /json/)
      .expect(404, {
        code: 404,
        message: messages.userNotFound,
      });

    // Try to delete a not existing user
    await request(server)
      .delete(`/api/users/${uuid()}`)
      .expect('Content-Type', /json/)
      .expect(404, {
        code: 404,
        message: messages.userNotFound,
      });

    // Check users are empty
    await request(server)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200, []);
  });
});
