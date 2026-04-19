import pool from '../database';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(err) {
            throw new Error(`Could not get products: ${err}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not find product ${id}: ${err}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const conn = await pool.connect();
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not create product ${p.name}: ${err}`);
        }
    }

    async update(p: Product): Promise<Product> {
        try {
            const conn = await pool.connect();
            const sql = 'UPDATE products SET name=$1, price=$2, category=$3 WHERE id=$4 RETURNING *';
            const result = await conn.query(sql, [p.name, p.price, p.category, p.id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not update product ${p.name}: ${err}`);
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const conn = await pool.connect();
            // delete from order_products first
            const sql1 = 'DELETE FROM order_products WHERE product_id=($1)';
            await conn.query(sql1, [id]);
            // then delete the product
            const sql2 = 'DELETE FROM products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql2, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not delete product ${id}: ${err}`);
        }
    }
}