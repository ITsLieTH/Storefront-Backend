import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const store = new OrderStore();

// GET all orders — protected
const index = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const orders = await store.index();
        res.json(orders);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// GET one order — protected
const show = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const order = await store.show(parseInt(req.params.id as string));
        res.json(order);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// POST create order — protected
const create = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const order: Order = {
            user_id: req.body.user_id,
            status: req.body.status
        };
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// POST add product to order — protected
const addProduct = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const order_id = parseInt(req.params.id as string);
        const product_id = parseInt(req.body.product_id as string);
        const quantity = parseInt(req.body.quantity as string);

        const result = await store.addProduct(order_id, product_id, quantity);
        res.json(result);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// DELETE order — protected
const destroy = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const deleted = await store.delete(parseInt(req.params.id as string));
        res.json(deleted);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

const order_routes = (app: express.Application) => {
    app.get('/orders', index);
    app.get('/orders/:id', show);
    app.post('/orders', create);
    app.post('/orders/:id/products', addProduct);
    app.delete('/orders/:id', destroy);
};

export default order_routes;