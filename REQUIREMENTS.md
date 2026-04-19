# API Requirements

## API Endpoints

### Users
| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Protected |
| GET | `/users/:id` | Protected |
| POST | `/users` | Public |
| POST | `/users/authenticate` | Public |
| DELETE | `/users/:id` | Protected |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/products` | Public |
| GET | `/products/:id` | Public |
| POST | `/products` | Protected |
| DELETE | `/products/:id` | Protected |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| GET | `/orders` | Protected |
| GET | `/orders/:id` | Protected |
| POST | `/orders` | Protected |
| POST | `/orders/:id/products` | Protected |
| DELETE | `/orders/:id` | Protected |

### Dashboard
| Method | Endpoint | Access |
|---|---|---|
| GET | `/products-in-orders` | Protected |
| GET | `/users/:user_id/active-orders` | Protected |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_digest VARCHAR(255) NOT NULL
);
```

### Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100)
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) NOT NULL
);
```

### Order Products Table
```sql
CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL
);
```