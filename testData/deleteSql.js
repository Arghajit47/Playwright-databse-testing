const deleteUsersTable = `DROP TABLE IF EXISTS users;`;
const deleteProductsTable = `DROP TABLE IF EXISTS products;`;
const deleteFromUsersWhereEmailIsEqual = `DELETE FROM users WHERE email = $1`;
const deleteFromProductsWhereEmailIsEqual = `DELETE FROM products WHERE email = $1`;
const deleteFromUsersWhereIdIsEqual = `DELETE FROM users WHERE id = $1`;
const deleteFromProductsWhereIdIsEqual = `DELETE FROM products WHERE id = $1`;
const deleteFromProductsWhereNameIsEqual = `DELETE FROM products WHERE name = $1`;
const deleteAllFromUsers = `DELETE FROM users`;
const deleteFromUsersWhereEmailIn = `DELETE FROM users WHERE email IN ($1, $2)`;
const deleteFromProductsWhereNameIn = `DELETE FROM products WHERE name IN ($1, $2)`;
const deleteFromProductsWherePriceLessThan = `DELETE FROM products WHERE price < $1`;
module.exports = {
  deleteUsersTable,
  deleteProductsTable,
  deleteFromUsersWhereEmailIsEqual,
  deleteFromProductsWhereEmailIsEqual,
  deleteFromUsersWhereIdIsEqual,
  deleteFromProductsWhereIdIsEqual,
  deleteFromProductsWhereNameIsEqual,
  deleteAllFromUsers,
  deleteFromUsersWhereEmailIn,
  deleteFromProductsWhereNameIn,
  deleteFromProductsWherePriceLessThan,
};
