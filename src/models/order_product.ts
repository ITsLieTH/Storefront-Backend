import pool from '../database';

export type OrderProduct = {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
};

export class OrderProductStore {
    async index(): Promise<OrderProduct[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM order_products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(err) {
            throw new Error(`Could not get order products: ${err}`);
        }
    }

    async show(id: number): Promise<OrderProduct> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM order_products WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not find order product ${id}: ${err}`);
        }
    }

    async create(op: OrderProduct): Promise<OrderProduct> {
        try {
            const conn = await pool.connect();
            const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [op.order_id, op.product_id, op.quantity]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not create order product: ${err}`);
        }
    }

    async delete(id: number): Promise<OrderProduct> {
        try {
            const conn = await pool.connect();
            const sql = 'DELETE FROM order_products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not delete order product ${id}: ${err}`);
        }
    }
}