import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { getManager } from 'typeorm';
import { initializeDB } from '../db';
import { Purchase } from '../entity/Purchase';
import { User } from '../entity/User';

const app = express();

app.get('/', async (req: Request, res: Response) => {
    const users = await User.find({ relations: ['purchases', 'purchases.categories']});
    users.forEach(u => {
        console.log(u);
    });
    const purchases = await Purchase.find({ relations: ['categories']});
    purchases.forEach(p => {
        console.log(p);
    });
    res.send('OK');
});

export default app;