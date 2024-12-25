const { test, expect } = require("@playwright/test");
const { runQuery } = require("../utils/dbUtils");
const insertSqlQuery = require("../testData/insertSql");
const updateSqlQuery = require("../testData/updateSql");
const selectSqlQuery = require("../testData/selectSql");
const deleteSqlQuery = require("../testData/deleteSql");

test.describe.configure({ mode: "serial" }); // Ensures tests run one by one

// Users Table Test Cases
test(
  "Insert a new user and verify insertion",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInUsers, [
      "John Doe",
      "john@example.com",
    ]);
    const user = await runQuery(
      selectSqlQuery.selectAllFromUsersWhereEmailIsEqual,
      ["john@example.com"]
    );
    expect(user[0].name).toBe("John Doe");
    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
      "john@example.com",
    ]);
  }
);

test(
  "Update the email of an existing user and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInUsers, [
      "Jane Doe",
      "jane@example.com",
    ]);
    await runQuery(updateSqlQuery.updateUsersSetEmailWhereName, [
      "jane.doe@example.com",
      "Jane Doe",
    ]);
    const user = await runQuery(
      selectSqlQuery.selectAllFromUsersWhereEmailIsEqual,
      ["jane.doe@example.com"]
    );
    expect(user[0].name).toBe("Jane Doe");
    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
      "jane.doe@example.com",
    ]);
  }
);

test("Delete a user by ID and verify", { tag: ["@database"] }, async () => {
  await runQuery(insertSqlQuery.insertDataInUsers, [
    "Alice",
    "alice@example.com",
  ]);
  const user = await runQuery(
    selectSqlQuery.selectAllFromUsersWhereEmailIsEqual,
    ["alice@example.com"]
  );
  await runQuery(deleteSqlQuery.deleteFromUsersWhereIdIsEqual, [user[0].id]);
  const deletedUser = await runQuery(
    selectSqlQuery.selectAllFromUsersWhereEmailIsEqual,
    ["alice@example.com"]
  );
  expect(deletedUser.length).toBe(0);
});

test(
  "Insert a user with a duplicate email and verify failure",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInUsers, [
      "User1",
      "duplicate@example.com",
    ]);
    try {
      await runQuery(insertSqlQuery.insertDataInUsers, [
        "User2",
        "duplicate@example.com",
      ]);
    } catch (err) {
      expect(err.message).toContain("duplicate key");
    }
    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
      "duplicate@example.com",
    ]);
  }
);

test("Retrieve a user by name", { tag: ["@database"] }, async () => {
  await runQuery(insertSqlQuery.insertDataInUsers, ["Bob", "bob@example.com"]);
  const user = await runQuery(
    selectSqlQuery.selectAllFromUsersWhereNameIsEqual,
    ["Bob"]
  );
  expect(user[0].email).toBe("bob@example.com");
  await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
    "bob@example.com",
  ]);
});

test("Retrieve users by email domain", { tag: ["@database"] }, async () => {
  await runQuery(insertSqlQuery.insertDataInUsers, [
    "Domain Tester",
    "tester@example.com",
  ]);
  const users = await runQuery(
    selectSqlQuery.selectAllFromUsersWhereEmailLike,
    ["%@example.com"]
  );
  expect(users.length).toBeGreaterThan(0);
  await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
    "tester@example.com",
  ]);
});

test(
  "Delete all users and verify the table is empty",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInUsers, [
      "Temporary User",
      "temp@example.com",
    ]);
    await runQuery(deleteSqlQuery.deleteAllFromUsers);
    const users = await runQuery(selectSqlQuery.selectAllFromUsers);
    expect(users.length).toBe(0);
  }
);

test(
  "Insert multiple users in a single query and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertMultipleDataInUsers, [
      "User One",
      "user1@example.com",
      "User Two",
      "user2@example.com",
    ]);
    const users = await runQuery(
      selectSqlQuery.selectAllFromUsersWhereEmailIn,
      ["user1@example.com", "user2@example.com"]
    );
    expect(users.length).toBe(2);
    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIn, [
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
      await runQuery(insertSqlQuery.insertDataUsersEmailValues, [
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
    await runQuery(insertSqlQuery.insertDataInUsers, [
      "Timestamp User",
      "timestamp@example.com",
    ]);
    const user = await runQuery(
      selectSqlQuery.selectAllFromUsersWhereEmailIsEqual,
      ["timestamp@example.com"]
    );
    expect(new Date(user[0].created_at)).toBeInstanceOf(Date);
    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
      "timestamp@example.com",
    ]);
  }
);

// Products Table Test Cases
test(
  "Insert a new product and verify insertion",
  { tag: ["@database"] },
  async () => {
    let price = 199.99;
    await runQuery(insertSqlQuery.insertDataInProducts, ["T-Shirt", price, 5]);
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["T-Shirt"]
    );
    expect(product[0].price).toBe(price.toFixed(2).toString());
    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
      "T-Shirt",
    ]);
  }
);

test(
  "Update the stock of an existing product and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInProducts, ["Tablet", 299.99, 10]);
    await runQuery(updateSqlQuery.updateProductsSetStockWhereName, [
      15,
      "Tablet",
    ]);
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["Tablet"]
    );
    expect(product[0].stock).toBe(15);
    await runQuery(deleteSqlQuery.deleteFromProductsWhereNameIsEqual, [
      "Tablet",
    ]);
  }
);

test("Delete a product by ID and verify", { tag: ["@database"] }, async () => {
  await runQuery(updateSqlQuery.updateProductsSetPriceAndStockWhereName, [
    499.99,
    20,
    "Smartphone",
  ]);
  const product = await runQuery(
    selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
    ["Smartphone"]
  );
  await runQuery(deleteSqlQuery.deleteFromProductsWhereIdIsEqual, [
    product[0].id,
  ]);
  const deletedProduct = await runQuery(
    selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
    ["Smartphone"]
  );
  expect(deletedProduct.length).toBe(0);
});

test(
  "Retrieve products within a specific price range",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInProducts, ["Monitor", 199.99, 8]);
    const products = await runQuery(
      selectSqlQuery.selectAllFromProductsWherePriceBetween,
      [100, 300]
    );
    expect(products.length).toBeGreaterThan(0);
    expect(products.some((p) => p.name === "Monitor")).toBeTruthy();
    await runQuery(deleteSqlQuery.deleteFromProductsWhereNameIsEqual, [
      "Monitor",
    ]);
  }
);

test(
  "Insert multiple products in a single query and verify",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertMultipleDataInProducts, [
      "Keyboard",
      49.99,
      50,
      "Mouse",
      29.99,
      100,
    ]);
    const products = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIn,
      ["Keyboard", "Mouse"]
    );
    expect(products.length).toBe(2);
    await runQuery(deleteSqlQuery.deleteFromProductsWhereNameIn, [
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
        insertSqlQuery.insertIntoProductsPriceAndStockValues,
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
    await runQuery(insertSqlQuery.insertDataInProducts, [
      "Timestamp Product",
      150.0,
      10,
    ]);

    // Retrieve the product that was just added
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["Timestamp Product"]
    );

    // Verify that the created_at field is a valid Date instance
    expect(new Date(product[0].created_at)).toBeInstanceOf(Date);

    // Clean up by removing the product
    await runQuery(deleteSqlQuery.deleteFromProductsWhereNameIsEqual, [
      "Timestamp Product",
    ]);
  }
);

// Extended Test Cases for Users Table
test(
  "Attempt to retrieve non-existent user",
  { tag: ["@database"] },
  async () => {
    const user = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["nonexistent@example.com"]
    );
    expect(user.length).toBe(0);
  }
);

test(
  "Verify unique constraint on users table",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInUsers, [
      "Unique User",
      "unique@example.com",
    ]);
    try {
      await runQuery(insertSqlQuery.insertDataInUsers, [
        "Duplicate User",
        "unique@example.com",
      ]);
    } catch (err) {
      expect(err.message).toContain(
        "duplicate key value violates unique constraint"
      );
    }
    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
      "unique@example.com",
    ]);
  }
);

// Extended Test Cases for Products Table
test(
  "Attempt to retrieve non-existent product",
  { tag: ["@database"] },
  async () => {
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["NonExistentProduct"]
    );
    expect(product.length).toBe(0);
  }
);

test(
  "Verify price update reflects correctly",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInProducts, ["Gadget", 20.0, 15]);
    await runQuery(updateSqlQuery.updateProductsSetPriceWhereName, [
      25.0,
      "Gadget",
    ]);
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["Gadget"]
    );
    expect(product[0].price).toBe("25.00");
    await runQuery(deleteSqlQuery.deleteFromProductsWhereNameIsEqual, [
      "Gadget",
    ]);
  }
);

test(
  "Insert and retrieve products with high stock",
  { tag: ["@database"] },
  async () => {
    await runQuery(insertSqlQuery.insertDataInProducts, [
      "Bulk Product",
      10.0,
      1000,
    ]);
    const products = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereStockGreaterThan,
      [500]
    );
    expect(products.some((p) => p.name === "Bulk Product")).toBeTruthy();
    await runQuery(deleteSqlQuery.deleteFromProductsWhereNameIsEqual, [
      "Bulk Product",
    ]);
  }
);

test(
  "Verify deletion of products below price threshold",
  { tag: ["@database"] },
  async () => {
    let price = 5.0;
    await runQuery(insertSqlQuery.insertDataInProducts, [
      "Cheap Product",
      price,
      10,
    ]);
    await runQuery(deleteSqlQuery.deleteFromProductsWherePriceLessThan, [10.0]);
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["Cheap Product"]
    );
    expect(product.length).toBe(0);
  }
);

// Cross-table Test Cases
test(
  "Verify user-product relationship is maintained",
  { tag: ["@database"] },
  async () => {
    let price = 100;
    await runQuery(insertSqlQuery.insertDataInUsers, [
      "Product Tester",
      "tester@example.com",
    ]);
    await runQuery(insertSqlQuery.insertDataInProducts, [
      "Tester Product",
      price,
      5,
    ]);

    const user = await runQuery(
      selectSqlQuery.selectAllFromUsersWhereEmailIsEqual,
      ["tester@example.com"]
    );
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["Tester Product"]
    );

    expect(user[0].name).toBe("Product Tester");
    expect(product[0].price).toBe(price.toFixed(2).toString());

    await runQuery(deleteSqlQuery.deleteFromUsersWhereEmailIsEqual, [
      "tester@example.com",
    ]);
    await runQuery(deleteSqlQuery.deleteFromProductsWhereNameIsEqual, [
      "Tester Product",
    ]);
  }
);

test(
  "Ensure rollback on failed transaction",
  { tag: ["@database"] },
  async () => {
    try {
      await runQuery("BEGIN");
      await runQuery(insertSqlQuery.insertDataInUsers, [
        "Transaction User",
        "rollback@example.com",
      ]);
      await runQuery(insertSqlQuery.insertDataInProducts, [
        "Transaction Product",
        50.0,
        5,
      ]);
      throw new Error("Simulated Failure");
    } catch (err) {
      await runQuery("ROLLBACK");
    }

    const user = await runQuery(
      selectSqlQuery.selectAllFromUsersWhereEmailIsEqual,
      ["rollback@example.com"]
    );
    const product = await runQuery(
      selectSqlQuery.selectAllFromProductsWhereNameIsEqual,
      ["Transaction Product"]
    );

    expect(user.length).toBe(0);
    expect(product.length).toBe(0);
  }
);
