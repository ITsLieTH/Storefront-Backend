import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const store = new UserStore();

// GET all users — protected
const index = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const users = await store.index();
        res.json(users);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// GET one user — protected
const show = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        const user = await store.show(parseInt(req.params.id as string));
        res.json(user);
    } catch(err) {
        res.status(401).json({ error: err });
    }
};

// POST create user — returns JWT token
const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            username: req.body.username,
            password: req.body.password
        };
        const newUser = await store.create(user);
        const token = jwt.sign(
            { user: newUser },
            process.env.TOKEN_SECRET as string
        );
        res.json({ user: newUser, token });
    } catch(err) {
        res.status(500).json({ error: err });
    }
};

// POST authenticate — login
const authenticate = async (req: Request, res: Response) => {
    try {
        const user = await store.authenticate(
            req.body.username,
            req.body.password
        );
        if(user) {
            const token = jwt.sign(
                { user },
                process.env.TOKEN_SECRET as string
            );
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch(err) {
        res.status(500).json({ error: err });
    }
};

// DELETE user — protected
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

const user_routes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create);
    app.post('/users/authenticate', authenticate);
    app.delete('/users/:id', destroy);
};

export default user_routes;