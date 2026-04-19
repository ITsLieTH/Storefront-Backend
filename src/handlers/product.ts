import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import jwt from 'jsonwebtoken';

const store = new ProductStore();

// GET all products
const index = async (req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.json(products);
    } catch(err) {
        res.status(500).json({ error: err });
    }
};

// GET one product
const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(parseInt(req.params.id as string));
        res.json(product);
    } catch(err) {
        res.status(500).json({ error: err });
    }
};

// POST create product — requires JWT
const create = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// DELETE product — requires JWT
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

const product_routes = (app: express.Application) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', create);
    app.delete('/products/:id', destroy);
};

export default product_routes;