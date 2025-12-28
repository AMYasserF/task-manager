const request = require('supertest');
const app = require('../src/index');

describe('Auth Endpoints', () => {
    let authToken;
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', testUser.email);
            authToken = res.body.token;
        });

        it('should not register user with existing email', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(res.statusCode).toBe(409);
        });

        it('should not register user with short password', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    name: 'Test',
                    email: 'new@example.com',
                    password: '123'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with invalid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
        });
    });
});
