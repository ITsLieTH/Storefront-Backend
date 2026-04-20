import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../user';
import { ProductStore } from '../product';
import { OrderStore } from '../order';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

let token: string;
let userId: number;
let productId: number;
let orderId: number;

describe('Endpoint Tests', () => {

    // create test data before all tests
    beforeAll(async () => {
        // create a test user and get token
        const user = await userStore.create({
            username: 'endpointtest',
            password: 'testpassword'
        });
        userId = user.id as number;

        // login to get token
        const response = await request
            .post('/users/authenticate')
            .send({ username: 'endpointtest', password: 'testpassword' });
        token = response.body.token;

        // create a test product
        const product = await productStore.create({
            name: 'Endpoint Test Product',
            price: 10.00,
            category: 'test'
        });
        productId = product.id as number;

        // create a test order
        const order = await orderStore.create({
            user_id: userId,
            status: 'active'
        });
        orderId = order.id as number;
    });

    // clean up after all tests
    afterAll(async () => {
        await orderStore.delete(orderId);
        await productStore.delete(productId);
        await userStore.delete(userId);
    });

    // ── USER ENDPOINTS ──────────────────────────

    describe('User Endpoints', () => {

        it('POST /users — creates a new user', async () => {
            const response = await request
                .post('/users')
                .send({ username: 'newuser123', password: 'password123' });
            expect(response.status).toBe(200);
            expect(response.body.user).toBeDefined();
            expect(response.body.token).toBeDefined();
            // clean up
            await userStore.delete(response.body.user.id);
        });

        it('POST /users/authenticate — returns token', async () => {
            const response = await request
                .post('/users/authenticate')
                .send({ username: 'endpointtest', password: 'testpassword' });
            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('GET /users — returns list of users', async () => {
            const response = await request
                .get('/users')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /users/:id — returns a user', async () => {
            const response = await request
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toEqual(userId);
        });

        it('GET /users — returns 401 without token', async () => {
            const response = await request.get('/users');
            expect(response.status).toBe(401);
        });

    });

    // ── PRODUCT ENDPOINTS ────────────────────────

    describe('Product Endpoints', () => {

        it('GET /products — returns list of products', async () => {
            const response = await request.get('/products');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /products/:id — returns a product', async () => {
            const response = await request.get(`/products/${productId}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toEqual(productId);
        });

        it('POST /products — creates a product with token', async () => {
            const response = await request
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'New Product', price: 25.00, category: 'test' });
            expect(response.status).toBe(200);
            expect(response.body.name).toEqual('New Product');
            // clean up
            await productStore.delete(response.body.id);
        });

        it('POST /products — returns 401 without token', async () => {
            const response = await request
                .post('/products')
                .send({ name: 'New Product', price: 25.00, category: 'test' });
            expect(response.status).toBe(401);
        });

        it('DELETE /products/:id — returns 401 without token', async () => {
            const response = await request.delete(`/products/${productId}`);
            expect(response.status).toBe(401);
        });

    });

    // ── ORDER ENDPOINTS ──────────────────────────

    describe('Order Endpoints', () => {

        it('GET /orders — returns list of orders', async () => {
            const response = await request
                .get('/orders')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /orders/:id — returns an order', async () => {
            const response = await request
                .get(`/orders/${orderId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toEqual(orderId);
        });

        it('POST /orders — creates an order with token', async () => {
            const response = await request
                .post('/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({ user_id: userId, status: 'active' });
            expect(response.status).toBe(200);
            expect(response.body.status).toEqual('active');
            // clean up
            await orderStore.delete(response.body.id);
        });

        it('POST /orders/:id/products — adds product to order', async () => {
            const response = await request
                .post(`/orders/${orderId}/products`)
                .set('Authorization', `Bearer ${token}`)
                .send({ product_id: productId, quantity: 2 });
            expect(response.status).toBe(200);
            expect(response.body.order_id).toEqual(orderId);
        });

        it('GET /orders — returns 401 without token', async () => {
            const response = await request.get('/orders');
            expect(response.status).toBe(401);
        });

    });

    // ── DASHBOARD ENDPOINTS ──────────────────────

    describe('Dashboard Endpoints', () => {

        it('GET /products-in-orders — returns products in orders', async () => {
            const response = await request
                .get('/products-in-orders')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });

        it('GET /users/:user_id/active-orders — returns active orders', async () => {
            const response = await request
                .get(`/users/${userId}/active-orders`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });

    });

});