const selectAllFromUsersWhereEmailIsEqual = `SELECT * FROM users WHERE email = $1`;
const selectAllFromProductsWhereNameIsEqual = `SELECT * FROM products WHERE name = $1`;
const selectAllFromUsersWhereNameIsEqual = `SELECT * FROM users WHERE name = $1`;
const selectAllFromUsersWhereEmailLike = `SELECT * FROM users WHERE email LIKE $1`;
const selectAllFromUsers = `SELECT * FROM users`;
const selectAllFromUsersWhereEmailIn = `SELECT * FROM users WHERE email IN ($1, $2)`;
const selectAllFromProductsWhereNameIn = `SELECT * FROM products WHERE name IN ($1, $2)`;
const selectAllFromProductsWhereStockGreaterThan = `SELECT * FROM products WHERE stock > $1`;
const selectAllFromProductsWherePriceBetween = `SELECT * FROM products WHERE price BETWEEN $1 AND $2`;
module.exports = {
  selectAllFromUsersWhereEmailIsEqual,
  selectAllFromUsersWhereNameIsEqual,
  selectAllFromProductsWhereNameIsEqual,
  selectAllFromUsersWhereEmailLike,
  selectAllFromUsers,
  selectAllFromUsersWhereEmailIn,
  selectAllFromProductsWhereNameIn,
  selectAllFromProductsWhereStockGreaterThan,
  selectAllFromProductsWherePriceBetween,
};
