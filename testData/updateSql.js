const updateUsersSetEmailWhereName = `UPDATE users SET email = $1 WHERE name = $2`;
const updateProductsSetStockWhereName = `UPDATE products SET stock = $1 WHERE name = $2`;
const updateProductsSetPriceAndStockWhereName = `UPDATE products SET price = $1, stock = $2 WHERE name = $3`;
const updateProductsSetPriceWhereName = `UPDATE products SET price = $1 WHERE name = $2`;

module.exports = {
  updateUsersSetEmailWhereName,
  updateProductsSetStockWhereName,
  updateProductsSetPriceAndStockWhereName,
  updateProductsSetPriceWhereName,
};
