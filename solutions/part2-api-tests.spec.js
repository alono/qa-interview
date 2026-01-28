/**
 * Part 2 - API Automation Tests
 * Framework: Jest + Supertest
 *
 * Run with: npm test
 */

const request = require('supertest');
const app = require('../src/server');

const BASE_URL = '/api/login';

describe('Login API', () => {

  describe('Positive Tests', () => {

    test('should return 200 and JWT token with valid credentials', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: 'user@example.com',
          password: 'Password123!'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);

      // Verify JWT structure (header.payload.signature)
      const tokenParts = response.body.token.split('.');
      expect(tokenParts).toHaveLength(3);
    });

  });

  describe('Negative Tests', () => {

    test('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: 'user@example.com',
          password: 'wrongpassword'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Unauthorized');
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
      expect(response.body).not.toHaveProperty('token');
    });

    test('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        })
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    test('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          password: 'Password123!'
        })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Email');
    });

    test('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: 'user@example.com'
        })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Password');
    });

    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: 'not-an-email',
          password: 'Password123!'
        })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('email');
    });

  });

  describe('Edge Cases', () => {

    test('should return 400 for empty request body', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    test('should return 400 for empty email string', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: '',
          password: 'Password123!'
        })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    test('should return 400 for empty password string', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: 'user@example.com',
          password: ''
        })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    test('should treat email as case-sensitive', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          email: 'USER@EXAMPLE.COM',
          password: 'Password123!'
        })
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

  });

});
