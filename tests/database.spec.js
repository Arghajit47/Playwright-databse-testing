const { test, expect } = require("@playwright/test");
const { runQuery } = require("../utils/dbUtils");
const {
  insertDataInUsers,
  insertDataInProducts,
} = require("../testData/insertSql");

test.describe.configure({ mode: "serial" }); // Ensures tests run one by one

// Users Table Test Cases
test(
  "Insert a new user and verify insertion",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInUsers, ["John Doe", "john@example.com"]);
    const user = await runQuery("SELECT * FROM users WHERE email = $1", [
      "john@example.com",
    ]);
    expect(user[0].name).toBe("John Doe");
    await runQuery("DELETE FROM users WHERE email = $1", ["john@example.com"]);
  }
);

test(
  "Update the email of an existing user and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInUsers, ["Jane Doe", "jane@example.com"]);
    await runQuery("UPDATE users SET email = $1 WHERE name = $2", [
      "jane.doe@example.com",
      "Jane Doe",
    ]);
    const user = await runQuery("SELECT * FROM users WHERE email = $1", [
      "jane.doe@example.com",
    ]);
    expect(user[0].name).toBe("Jane Doe");
    await runQuery("DELETE FROM users WHERE email = $1", [
      "jane.doe@example.com",
    ]);
  }
);

test("Delete a user by ID and verify", { tag: ["@database"] }, async () => {
  await runQuery(insertDataInUsers, ["Alice", "alice@example.com"]);
  const user = await runQuery("SELECT * FROM users WHERE email = $1", [
    "alice@example.com",
  ]);
  await runQuery("DELETE FROM users WHERE id = $1", [user[0].id]);
  const deletedUser = await runQuery("SELECT * FROM users WHERE email = $1", [
    "alice@example.com",
  ]);
  expect(deletedUser.length).toBe(0);
});

test(
  "Insert a user with a duplicate email and verify failure",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInUsers, ["User1", "duplicate@example.com"]);
    try {
      await runQuery("INSERT INTO users (name, email) VALUES ($1, $2)", [
        "User2",
        "duplicate@example.com",
      ]);
    } catch (err) {
      expect(err.message).toContain("duplicate key");
    }
    await runQuery("DELETE FROM users WHERE email = $1", [
      "duplicate@example.com",
    ]);
  }
);

test("Retrieve a user by name", { tag: ["@database"] }, async () => {
  await runQuery(insertDataInUsers, ["Bob", "bob@example.com"]);
  const user = await runQuery("SELECT * FROM users WHERE name = $1", ["Bob"]);
  expect(user[0].email).toBe("bob@example.com");
  await runQuery("DELETE FROM users WHERE email = $1", ["bob@example.com"]);
});

test("Retrieve users by email domain", { tag: ["@database"] }, async () => {
  await runQuery(insertDataInUsers, ["Domain Tester", "tester@example.com"]);
  const users = await runQuery("SELECT * FROM users WHERE email LIKE $1", [
    "%@example.com",
  ]);
  expect(users.length).toBeGreaterThan(0);
  await runQuery("DELETE FROM users WHERE email = $1", ["tester@example.com"]);
});

test(
  "Delete all users and verify the table is empty",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInUsers, ["Temporary User", "temp@example.com"]);
    await runQuery("DELETE FROM users");
    const users = await runQuery("SELECT * FROM users");
    expect(users.length).toBe(0);
  }
);

test(
  "Insert multiple users in a single query and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(
      "INSERT INTO users (name, email) VALUES ($1, $2), ($3, $4)",
      ["User One", "user1@example.com", "User Two", "user2@example.com"]
    );
    const users = await runQuery(
      "SELECT * FROM users WHERE email IN ($1, $2)",
      ["user1@example.com", "user2@example.com"]
    );
    expect(users.length).toBe(2);
    await runQuery("DELETE FROM users WHERE email IN ($1, $2)", [
      "user1@example.com",
      "user2@example.com",
    ]);
  }
);

test(
  "Attempt to insert a user without a name and verify failure",
  { tag: ["@database"] },
  async () => {
    try {
      await runQuery("INSERT INTO users (email) VALUES ($1)", [
        "noname@example.com",
      ]);
    } catch (err) {
      expect(err.message).toContain('null value in column "name"');
    }
  }
);

test(
  "Verify created_at timestamp for a new user",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInUsers, [
      "Timestamp User",
      "timestamp@example.com",
    ]);
    const user = await runQuery("SELECT * FROM users WHERE email = $1", [
      "timestamp@example.com",
    ]);
    expect(new Date(user[0].created_at)).toBeInstanceOf(Date);
    await runQuery("DELETE FROM users WHERE email = $1", [
      "timestamp@example.com",
    ]);
  }
);

// Products Table Test Cases
test(
  "Insert a new product and verify insertion",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInProducts, ["T-Shirt", 199.99, 5]);
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "T-Shirt",
    ]);
    expect(product[0].price).toBe("199.99");
    await runQuery("DELETE FROM products WHERE name = $1", ["T-Shirt"]);
  }
);

test(
  "Update the stock of an existing product and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInProducts, ["Tablet", 299.99, 10]);
    await runQuery("UPDATE products SET stock = $1 WHERE name = $2", [
      15,
      "Tablet",
    ]);
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "Tablet",
    ]);
    expect(product[0].stock).toBe(15);
    await runQuery("DELETE FROM products WHERE name = $1", ["Tablet"]);
  }
);

test("Delete a product by ID and verify", { tag: ["@database"] }, async () => {
  await runQuery("UPDATE products SET price = $1, stock = $2 WHERE name = $3", [
    499.99,
    20,
    "Smartphone",
  ]);
  const product = await runQuery("SELECT * FROM products WHERE name = $1", [
    "Smartphone",
  ]);
  await runQuery("DELETE FROM products WHERE id = $1", [product[0].id]);
  const deletedProduct = await runQuery(
    "SELECT * FROM products WHERE name = $1",
    ["Smartphone"]
  );
  expect(deletedProduct.length).toBe(0);
});

test(
  "Retrieve products within a specific price range",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInProducts, ["Monitor", 199.99, 8]);
    const products = await runQuery(
      "SELECT * FROM products WHERE price BETWEEN $1 AND $2",
      [100, 300]
    );
    expect(products.length).toBeGreaterThan(0);
    expect(products.some((p) => p.name === "Monitor")).toBeTruthy();
    await runQuery("DELETE FROM products WHERE name = $1", ["Monitor"]);
  }
);

test(
  "Insert multiple products in a single query and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3), ($4, $5, $6)",
      ["Keyboard", 49.99, 50, "Mouse", 29.99, 100]
    );
    const products = await runQuery(
      "SELECT * FROM products WHERE name IN ($1, $2)",
      ["Keyboard", "Mouse"]
    );
    expect(products.length).toBe(2);
    await runQuery("DELETE FROM products WHERE name IN ($1, $2)", [
      "Keyboard",
      "Mouse",
    ]);
  }
);

test(
  "Attempt to insert a product without a name and verify failure",
  { tag: ["@database"] },
  async () => {
    try {
      await runQuery(
        "INSERT INTO products (price, stock) VALUES ($1, $2)",
        [99.99, 10]
      );
    } catch (err) {
      expect(err.message).toContain('null value in column "name"');
    }
  }
);

test(
  "Verify created_at timestamp for a new product",
  { tag: ["@database"] },
  async () => {
    // Insert a new product into the database
    await runQuery(insertDataInProducts, ["Timestamp Product", 150.0, 10]);

    // Retrieve the product that was just added
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "Timestamp Product",
    ]);

    // Verify that the created_at field is a valid Date instance
    expect(new Date(product[0].created_at)).toBeInstanceOf(Date);

    // Clean up by removing the product
    await runQuery("DELETE FROM products WHERE name = $1", [
      "Timestamp Product",
    ]);
  }
);

// Extended Test Cases for Users Table
test(
  "Attempt to retrieve non-existent user",
  { tag: ["@database"] },
  async () => {
    const user = await runQuery("SELECT * FROM users WHERE email = $1", [
      "nonexistent@example.com",
    ]);
    expect(user.length).toBe(0);
  }
);

test(
  "Verify unique constraint on users table",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInUsers, ["Unique User", "unique@example.com"]);
    try {
      await runQuery(insertDataInUsers, [
        "Duplicate User",
        "unique@example.com",
      ]);
    } catch (err) {
      expect(err.message).toContain(
        "duplicate key value violates unique constraint"
      );
    }
    await runQuery("DELETE FROM users WHERE email = $1", [
      "unique@example.com",
    ]);
  }
);

// Extended Test Cases for Products Table
test(
  "Attempt to retrieve non-existent product",
  { tag: ["@database"] },
  async () => {
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "NonExistentProduct",
    ]);
    expect(product.length).toBe(0);
  }
);

test(
  "Verify price update reflects correctly",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInProducts, ["Gadget", 20.0, 15]);
    await runQuery("UPDATE products SET price = $1 WHERE name = $2", [
      25.0,
      "Gadget",
    ]);
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "Gadget",
    ]);
    expect(product[0].price).toBe("25.00");
    await runQuery("DELETE FROM products WHERE name = $1", ["Gadget"]);
  }
);

test(
  "Insert and retrieve products with high stock",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertDataInProducts, ["Bulk Product", 10.0, 1000]);
    const products = await runQuery("SELECT * FROM products WHERE stock > $1", [
      500,
    ]);
    expect(products.some((p) => p.name === "Bulk Product")).toBeTruthy();
    await runQuery("DELETE FROM products WHERE name = $1", ["Bulk Product"]);
  }
);

test(
  "Verify deletion of products below price threshold",
  { tag: ["@database"] },
  async () => {
    let price = 5.0;
    await runQuery(insertDataInProducts, ["Cheap Product", price, 10]);
    await runQuery("DELETE FROM products WHERE price < $1", [10.0]);
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "Cheap Product",
    ]);
    expect(product.length).toBe(0);
  }
);

// Cross-table Test Cases
test(
  "Verify user-product relationship is maintained",
  { tag: ["@database"] },
  async () => {
    let price = 100;
    await runQuery(insertDataInUsers, ["Product Tester", "tester@example.com"]);
    await runQuery(insertDataInProducts, ["Tester Product", price, 5]);

    const user = await runQuery("SELECT * FROM users WHERE email = $1", [
      "tester@example.com",
    ]);
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "Tester Product",
    ]);

    expect(user[0].name).toBe("Product Tester");
    expect(product[0].price).toBe(price.toFixed(2).toString());

    await runQuery("DELETE FROM users WHERE email = $1", [
      "tester@example.com",
    ]);
    await runQuery("DELETE FROM products WHERE name = $1", ["Tester Product"]);
  }
);

test(
  "Ensure rollback on failed transaction",
  { tag: ["@database"] },
  async () => {
    try {
      await runQuery("BEGIN");
      await runQuery(insertDataInUsers, [
        "Transaction User",
        "rollback@example.com",
      ]);
      await runQuery(insertDataInProducts, ["Transaction Product", 50.0, 5]);
      throw new Error("Simulated Failure");
    } catch (err) {
      await runQuery("ROLLBACK");
    }

    const user = await runQuery("SELECT * FROM users WHERE email = $1", [
      "rollback@example.com",
    ]);
    const product = await runQuery("SELECT * FROM products WHERE name = $1", [
      "Transaction Product",
    ]);

    expect(user.length).toBe(0);
    expect(product.length).toBe(0);
  }
);
