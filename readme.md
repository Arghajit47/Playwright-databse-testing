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


## Workflow Overview (CI/CD)

The workflow performs the following steps:

1. **Checkout Code**: Checks out the repository code.
2. **Set up Node.js**: Sets up Node.js using the latest LTS version.
3. **Install Dependencies**: Installs the project dependencies using `npm ci`.
4. **Install Playwright Browsers**: Installs the necessary Playwright browsers.
5. **Set up Environment Variables**: Sets up the environment variables for the database connection.
6. **Create Database Tables and Seed Data**: Runs a script to create database tables and seed data.
7. **Run Playwright Tests**: Executes the Playwright tests.
8. **Tear Down Database Tables and Data**: Runs a script to tear down the database tables and data.
9. **Upload Playwright Test Reports**: Uploads the Playwright test reports as an artifact.

### Environment Variables

The following environment variables are required for the database connection and should be set as GitHub Secrets:

- `DB_USER`: The database user.
- `DB_HOST`: The database host.
- `DB_NAME`: The database name.
- `DB_PASSWORD`: The database password.
- `DB_PORT`: The database port.

### Workflow File

Below is the complete workflow file (`.github/workflows/playwright.yml`):

```yaml
name: Playwright Database Testing

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    env:
      DB_USER: ${{ secrets.DB_USER }}
      DB_HOST: ${{ secrets.DB_HOST }}
      DB_NAME: ${{ secrets.DB_NAME }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
      DB_PORT: ${{ secrets.DB_PORT }}
    services:
      postgres:
        image: postgres:latest
        env:
          POSTGRES_USER: ${{ secrets.DB_USER }}
          POSTGRES_PASSWORD: ${{ secrets.DB_PASSWORD }}
          POSTGRES_DB: ${{ secrets.DB_NAME }}
        ports:
          - 5432:5432
    steps:
      # Checkout code
      - uses: actions/checkout@v4

      # Set up Node.js
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      # Install dependencies
      - name: Install dependencies
        run: npm ci

      # Install Playwright browsers
      - name: Install Playwright Browsers
        run: npx playwright install

      # Set up environment variables
      - name: Set Environment Variables
        run: echo "DB_USER=${{ secrets.DB_USER }}\nDB_HOST=${{ secrets.DB_HOST }}\nDB_NAME=${{ secrets.DB_NAME }}\nDB_PASSWORD=${{ secrets.DB_PASSWORD }}\nDB_PORT=${{ secrets.DB_PORT }}" >> $GITHUB_ENV

      # Create database tables and seed data
      - name: Creates data tables and inserts data into tables
        env:
          DB_USER: ${{ secrets.DB_USER }}
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_NAME: ${{ secrets.DB_NAME }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_PORT: ${{ secrets.DB_PORT }}
        run: npm run setup

      # Run Playwright tests
      - name: Run Playwright tests
        env:
          DB_USER: ${{ secrets.DB_USER }}
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_NAME: ${{ secrets.DB_NAME }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_PORT: ${{ secrets.DB_PORT }}
        run: npx playwright test

      # Tear down database tables and data
      - name: Deletes the data table and their data
        env:
          DB_USER: ${{ secrets.DB_USER }}
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_NAME: ${{ secrets.DB_NAME }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_PORT: ${{ secrets.DB_PORT }}
        run: npm run teardown

      # Upload Playwright test reports
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Additional Information

- Test results will be displayed in the console, and errors will highlight failed assertions.
- You can add more test cases or modify existing ones in the `database.spec.js` files.

## License

This project is licensed under the ISC License.
