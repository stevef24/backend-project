const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesControllers");
const {
	getReviews,
	getReviewsById,
} = require("./controllers/reviewsController");
const {
	errorPSQLHandler,
	handleCustomErrors,
	error500Handler,
} = require("./controllers/errorHandeling");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.use((req, res, next) => {
	res.status(404).send({ msg: "Path not found" });
});

app.use(errorPSQLHandler);
app.use(error500Handler);
app.use(handleCustomErrors);

module.exports = app;
