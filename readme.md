# Database Testing with Playwright

This repository demonstrates database automation testing using Playwright JS for PostgreSQL. The test cases include operations such as data insertion, retrieval, updates, and deletions for `users` and `products` tables. These tests ensure data consistency and correctness during database interactions.

## Folder Structure

```
|-- tests
|   |-- database.spec.js
|-- testData
|   |-- createSql.js
|   |-- deleteSql.js
|   |-- insertSql.js
|-- utils
|   |-- dbUtils.js
|-- setup.js
|-- teardown.js
|-- README.md
```

- **`tests/`**: Contains the Playwright test scripts.
- **`testData/`**: Contains the SQL Queries based on their type of operations (CREATE, DELETE, INSERT).
- **`utils/dbUtils.js`**: Utility functions for interacting with the PostgreSQL database.
- **`setup.js`**: Creates data tables and inserts data into tables.
- **`teardown.js`**: Deletes the data table and their data.
- **`README.md`**: This file, providing setup instructions and usage guidelines.

## Prerequisites

1. **Node.js**: Install the latest version of Node.js from [Node.js Official Site](https://nodejs.org/).
2. **PostgreSQL**: Install PostgreSQL and ensure the service is running.

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository_url>
cd <repository_folder>
```

### Step 2: Install Dependencies

Install the necessary Node.js packages:

```bash
npm install
```

### Step 3: Set Up PostgreSQL Database

1. **Start PostgreSQL**: Make sure your PostgreSQL server is running. You can start it using the command specific to your operating system:

   - On Linux:
     ```bash
     sudo service postgresql start
     ```
   - On macOS (with Homebrew):
     ```bash
     brew services start postgresql
     ```
   - On Windows: Use the pgAdmin interface or start the PostgreSQL service from the Services panel.

2. **Log in to PostgreSQL**: Open the PostgreSQL interactive terminal (`psql`) and log in as the default user:

   ```bash
   psql -U postgres
   ```

3. **Create a Database**: Run the following command to create a new database named `dummy_db`:

   ```sql
   CREATE DATABASE dummy_db;
   ```

4. **Switch to the Database**: Connect to the newly created database:

   ```sql
   \c dummy_db;
   ```

5. **Create Tables**: Execute the following SQL commands to create the `users` and `products` tables:

   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE products (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       price NUMERIC(10, 2) NOT NULL,
       stock INTEGER NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

6. **Insert Sample Data (Optional)**: Populate the tables with sample data for testing purposes:

   ```sql
   INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
   INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');

   INSERT INTO products (name, price, stock) VALUES ('Laptop', 999.99, 5);
   INSERT INTO products (name, price, stock) VALUES ('Phone', 499.99, 10);
   ```

7. **Verify Setup**: Confirm that the tables and data exist by running the following queries:
   ```sql
   SELECT * FROM users;
   SELECT * FROM products;
   ```

If everything is set up correctly, you should see the inserted data displayed in the results.

### Step 4: Configure Database Connection

Update `dbUtils.js` to match your PostgreSQL configuration:

```javascript
const config = {
  user: "postgres",
  host: "localhost",
  database: "dummy_db",
  password: "your_password",
  port: 5432,
};
```

## Running Tests

Run the Playwright tests using the following command:

```bash
npx playwright test tests/dbTests
```

## Test Coverage

### Users Table

- Insert, update, and delete operations.
- Verifying constraints like unique email and non-null name.
- Querying users by specific attributes (e.g., email, name).
- Validating timestamps.

### Products Table

- Insert, update, and delete operations.
- Price range queries and stock updates.
- Validating constraints and timestamps.

## Additional Information

- Test results will be displayed in the console, and errors will highlight failed assertions.
- You can add more test cases or modify existing ones in the `database.spec.js` files.

## License

This project is licensed under the ISC License.
