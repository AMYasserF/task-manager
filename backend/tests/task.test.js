const request = require('supertest');
const app = require('../src/index');

describe('Task Endpoints', () => {
    let authToken;
    let taskId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: 'Task Tester',
                email: `tasktester${Date.now()}@example.com`,
                password: 'password123'
            });
        authToken = res.body.token;
    });

    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Task',
                    description: 'Test Description'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe('Test Task');
            taskId = res.body.id;
        });

        it('should not create task without auth', async () => {
            const res = await request(app)
                .post('/tasks')
                .send({
                    title: 'Test Task'
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /tasks', () => {
        it('should get all tasks with pagination', async () => {
            const res = await request(app)
                .get('/tasks?page=1&limit=10')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('tasks');
            expect(res.body).toHaveProperty('pagination');
            expect(Array.isArray(res.body.tasks)).toBe(true);
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update task status', async () => {
            const res = await request(app)
                .put(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'done'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('done');
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            const res = await request(app)
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });
    });
});
