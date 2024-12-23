const { runQuery } = require("./utils/dbUtils");
const createQuery = require("./testData/createSql");
const insertQuery = require("./testData/insertSql");

async function dataBaseSetup() {
  console.log("Create the database and create the table and data");
  await runQuery(createQuery.createUsersTable);
  await runQuery(createQuery.createProductsTable);

  await runQuery(insertQuery.insertUsers);
  await runQuery(insertQuery.insertProducts);
}

dataBaseSetup();
