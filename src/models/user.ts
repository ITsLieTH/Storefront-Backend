import pool from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

export type User = {
    id?: number;
    username: string;
    password: string;
};


export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(err) {
            throw new Error(`Could not get users: ${err}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not find user ${id}: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await pool.connect();
            const sql = 'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *';
            
            const hash = bcrypt.hashSync(
                u.password + pepper,
                parseInt(saltRounds)
            );

            const result = await conn.query(sql, [u.username, hash]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not create user ${u.username}: ${err}`);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            const conn = await pool.connect();
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Could not delete user ${id}: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT password_digest FROM users WHERE username=($1)';
            const result = await conn.query(sql, [username]);

            if(result.rows.length) {
                const user = result.rows[0];
                if(bcrypt.compareSync(password + pepper, user.password_digest)) {
                    return user;
                }
            }

            conn.release();
            return null;
        } catch(err) {
            throw new Error(`Could not authenticate user ${username}: ${err}`);
        }
    }
}