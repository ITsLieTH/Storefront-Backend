import { User, UserStore } from '../user';

const store = new UserStore();

describe('User Model', () => {

    // runs before all tests — clean up any existing testuser
    beforeAll(async () => {
        const users = await store.index();
        const testUser = users.find(u => u.username === 'testuser');
        if(testUser) {
            await store.delete(testUser.id as number);
        }
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

    it('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });

    it('create method should add a user', async () => {
        const result = await store.create({
            username: 'testuser',
            password: 'testpassword'
        });
        expect(result.id).toBeDefined();
        expect(result.username).toEqual('testuser');
    });

    it('authenticate method should return the user', async () => {
        const result = await store.authenticate('testuser', 'testpassword');
        expect(result).not.toBeNull();
    });

    it('authenticate method should return null for wrong password', async () => {
        const result = await store.authenticate('testuser', 'wrongpassword');
        expect(result).toBeNull();
    });

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('delete method should remove the user', async () => {
        const users = await store.index();
        const testUser = users.find(u => u.username === 'testuser');
        await store.delete(testUser?.id as number);
        const result = await store.index();
        expect(result.find(u => u.username === 'testuser')).toBeUndefined();
    });

});