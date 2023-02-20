const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesControllers");
const { getReviews } = require("./controllers/reviewsController");
const {
	errorPSQLHandler,
	handleCustomErrors,
	error500Handler,
} = require("./controllers/errorHandeling");
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.use(errorPSQLHandler);
app.use(error500Handler);

app.all("/*", handleCustomErrors);

module.exports = app;
