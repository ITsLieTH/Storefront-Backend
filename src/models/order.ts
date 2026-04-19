import pool from '../database';

export type Order = {
    id?: number;
    user_id: number;
    status: string;
};

export type OrderProduct = {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(err) {
            throw new Error(`Could not get orders: ${err}`);
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not find order ${id}: ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await pool.connect();
            const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
            const result = await conn.query(sql, [o.user_id, o.status]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not create order: ${err}`);
        }
    }

    async delete(id: number): Promise<Order> {
        try {
            const conn = await pool.connect();
            // delete from order_products first
            const sql1 = 'DELETE FROM order_products WHERE order_id=($1)';
            await conn.query(sql1, [id]);
            // then delete the order
            const sql2 = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            const result = await conn.query(sql2, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not delete order ${id}: ${err}`);
        }
    }

    async addProduct(order_id: number, product_id: number, quantity: number): Promise<OrderProduct> {
        try {
            const conn = await pool.connect();
            const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [order_id, product_id, quantity]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not add product to order: ${err}`);
        }
    }
}