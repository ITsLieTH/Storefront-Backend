import { Product, ProductStore } from '../product';

const store = new ProductStore();
let productId: number;

describe('Product Model', () => {

    beforeAll(async () => {
        // create a test product to use in tests
        const product = await store.create({
            name: 'Test Sword',
            price: 50.00,
            category: 'weapons'
        });
        productId = product.id as number;
    });

    afterAll(async () => {
        // clean up after all tests
        await store.delete(productId);
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

    it('create method should add a product', async () => {
        const result = await store.create({
            name: 'Test Shield',
            price: 30.00,
            category: 'armor'
        });
        expect(result.id).toBeDefined();
        expect(result.name).toEqual('Test Shield');
        expect(result.category).toEqual('armor');
        expect(parseFloat(result.price as unknown as string)).toEqual(30.00);
        // clean up this extra product
        await store.delete(result.id as number);
    });

    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('show method should return the correct product', async () => {
        const result = await store.show(productId);
        expect(result.name).toBeDefined();
    });

    it('delete method should remove the product', async () => {
        const product = await store.create({
            name: 'Delete Me',
            price: 10.00,
            category: 'test'
        });
        await store.delete(product.id as number);
        const result = await store.index();
        expect(result.find(p => p.id === product.id)).toBeUndefined();
    });

});