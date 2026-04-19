import pool from '../database';
import {Order} from '../models/order';
 
export type ProductInOrder = {
    id: number;
    name: string;
    price: number;
    order_id: number;
    quantity: number;
};

export class DashboardQueries {
    // Gets all products that are currently in orders
    async productsInOrders(): Promise<ProductInOrder[]> {
        try {
            const conn = await pool.connect();
            const sql = `SELECT products.id, products.name, products.price, 
                        order_products.order_id, order_products.quantity 
                        FROM products 
                        INNER JOIN order_products 
                        ON products.id = order_products.product_id`;
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(err) {
            throw new Error(`Could not get products in orders: ${err}`);
        }
    }

    // Gets all active orders for a specific user
    async activeOrdersByUser(user_id: number): Promise<Order[]> {
        try {
            const conn = await pool.connect();
            const sql = `SELECT * FROM orders 
                        WHERE user_id=($1) 
                        AND status='active'`;
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows;
        } catch(err) {
            throw new Error(`Could not get active orders: ${err}`);
        }
    }
}