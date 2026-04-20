import { OrderProduct, OrderProductStore } from '../order_product';
import { OrderStore } from '../order';
import { ProductStore } from '../product';

const store = new OrderProductStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

let orderProductId: number;
let orderId: number;
let productId: number;

describe('OrderProduct Model', () => {

    beforeAll(async () => {
        // create a test product
        const product = await productStore.create({
            name: 'OP Test Product',
            price: 15.00,
            category: 'test'
        });
        productId = product.id as number;

        // create a test order
        const order = await orderStore.create({
            user_id: 1,
            status: 'active'
        });
        orderId = order.id as number;

        // create a test order product
        const orderProduct = await store.create({
            order_id: orderId,
            product_id: productId,
            quantity: 3
        });
        orderProductId = orderProduct.id as number;
    });

    afterAll(async () => {
        await store.delete(orderProductId);
        await orderStore.delete(orderId);
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

    it('create method should add an order product', async () => {
        const result = await store.create({
            order_id: orderId,
            product_id: productId,
            quantity: 5
        });
        expect(result.id).toBeDefined();
        expect(result.order_id).toEqual(orderId);
        expect(result.product_id).toEqual(productId);
        expect(result.quantity).toEqual(5);
        // clean up
        await store.delete(result.id as number);
    });

    it('index method should return a list of order products', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('show method should return the correct order product', async () => {
        const result = await store.show(orderProductId);
        expect(result.id).toEqual(orderProductId);
    });

    it('delete method should remove the order product', async () => {
        const op = await store.create({
            order_id: orderId,
            product_id: productId,
            quantity: 1
        });
        await store.delete(op.id as number);
        const result = await store.index();
        expect(result.find(o => o.id === op.id)).toBeUndefined();
    });

});