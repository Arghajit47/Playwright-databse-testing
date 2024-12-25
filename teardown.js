const { runQuery } = require("./utils/dbUtils");
const deleteQuery = require("./sqlQueries/deleteSql");

async function dataBaseTeardown() {
  console.log("Delete the Tables and data");
  await runQuery(deleteQuery.deleteUsersTable);
  await runQuery(deleteQuery.deleteProductsTable);
}

dataBaseTeardown();
