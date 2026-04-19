import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const dashboard = new DashboardQueries();

// GET all products in orders — protected
const productsInOrders = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const products = await dashboard.productsInOrders();
        res.json(products);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// GET active orders by user — protected
const activeOrdersByUser = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const orders = await dashboard.activeOrdersByUser(
            parseInt(req.params.user_id as string)
        );
        res.json(orders);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

const dashboard_routes = (app: express.Application) => {
    // Gets all products that are in orders
    app.get('/products-in-orders', productsInOrders);
    // Gets all active orders for a specific user
    app.get('/users/:user_id/active-orders', activeOrdersByUser);
};

export default dashboard_routes;