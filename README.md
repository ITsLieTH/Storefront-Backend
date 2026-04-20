# Storefront API

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies

### Models
- Users
- Products
- Orders
- Order Products

### Database Setup
1. Create two PostgreSQL databases in pgAdmin or psql:

```sql
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;
```

2. Create a user and grant privileges:

```sql
CREATE USER storefront_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
```

3. Run migrations:

```
npm run migrate-up
```

### Environment Variables
Create a `.env` file in the root of the project with the following:

```
ENV=dev
PORT=3000
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=your_password
BCRYPT_PASSWORD=your_bcrypt_password
SALT_ROUNDS=10
TOKEN_SECRET=your_token_secret
```

### Running the Server
```
npm run watch
```
Server runs on port **3000**

### Running the Tests
```
npm run build
npm run test
```

### Ports
- Backend: port **3000**
- Database: port **5432**