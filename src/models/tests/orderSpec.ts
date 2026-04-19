import { Order, OrderStore } from '../order';
import { ProductStore } from '../product';

const store = new OrderStore();
const productStore = new ProductStore();
let orderId: number;
let productId: number;

describe('Order Model', () => {

    beforeAll(async () => {
        // create a test product to use in addProduct test
        const product = await productStore.create({
            name: 'Test Product',
            price: 10.00,
            category: 'test'
        });
        productId = product.id as number;

        // create a test order
        const order = await store.create({
            user_id: 1,
            status: 'active'
        });
        orderId = order.id as number;
    });

    afterAll(async () => {
        // clean up after all tests
        await store.delete(orderId);
        await productStore.delete(productId);
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('should have an addProduct method', () => {
        expect(store.addProduct).toBeDefined();
    });

    it('create method should add an order', async () => {
        const result = await store.create({
            user_id: 1,
            status: 'active'
        });
        expect(result.id).toBeDefined();
        expect(result.status).toEqual('active');
        expect(result.user_id).toEqual(1);
        // clean up
        await store.delete(result.id as number);
    });

    it('index method should return a list of orders', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('show method should return the correct order', async () => {
        const result = await store.show(orderId);
        expect(result.id).toBeDefined();
    });

    it('addProduct method should add a product to an order', async () => {
        const result = await store.addProduct(orderId, productId, 2);
        expect(result.order_id).toEqual(orderId);
        expect(result.quantity).toEqual(2);
    });

    it('delete method should remove the order', async () => {
        const order = await store.create({
            user_id: 1,
            status: 'active'
        });
        await store.delete(order.id as number);
        const result = await store.index();
        expect(result.find(o => o.id === order.id)).toBeUndefined();
    });

});