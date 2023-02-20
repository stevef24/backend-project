const express = require("express");
const app = express();
const port = 3000;
const { getCategories } = require("./controllers/categoriesControllers");
const {
	errorPSQLHandler,
	handleCustomErrors,
	error500Handler,
} = require("./controllers/errorHandeling");
app.get("/api/categories", getCategories);

app.use(errorPSQLHandler);
app.use(handleCustomErrors);
app.use(error500Handler);

module.exports = app;
