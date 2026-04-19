import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import product_routes from './handlers/product';
import user_routes from './handlers/user';
import order_routes from './handlers/order';
import dashboard_routes from './handlers/dashboard';

dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

dashboard_routes(app);

app.get('/', function(req: Request, res: Response) {
    res.send('Hello, Storefront API!');
});

// register all routes
product_routes(app);
user_routes(app);
order_routes(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;