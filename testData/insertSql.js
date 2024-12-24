const insertUsers = `INSERT INTO users (name, email) VALUES
('John Doe', 'john@blog.com'),
('Jane Smith', 'jane@blog.com'),
('Alice Brown', 'alice@blog.com');`;
const insertProducts = `INSERT INTO products (name, price, stock) VALUES
('Laptop', 799.99, 10),
('Smartphone', 499.99, 25),
('Tablet', 299.99, 15);`;

const insertDataInUsers = `INSERT INTO users (name, email) VALUES ($1, $2)`;
const insertMultipleDataInUsers = `INSERT INTO users (name, email) VALUES ($1, $2), ($3, $4)`;
const insertDataInProducts = `INSERT INTO products (name, price, stock) VALUES ($1, $2, $3)`;
const insertMultipleDataInProducts = `INSERT INTO products (name, price, stock) VALUES ($1, $2, $3), ($4, $5, $6)`;
const insertDataUsersEmailValues = `INSERT INTO users (email) VALUES ($1)`;
const insertIntoProductsPriceAndStockValues = `INSERT INTO products (price, stock) VALUES ($1, $2)`;

module.exports = {
  insertUsers,
  insertProducts,
  insertDataInUsers,
  insertMultipleDataInUsers,
  insertDataInProducts,
  insertDataUsersEmailValues,
  insertMultipleDataInProducts,
  insertIntoProductsPriceAndStockValues,
};
