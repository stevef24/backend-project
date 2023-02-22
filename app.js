const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesControllers");
const {
	getReviews,
	getAllComments,
	getReviewsById,
	patchReview,
	postComments,
	getUsers,
} = require("./controllers/reviewsController");

const {
	errorPSQLHandler,
	handleCustomErrors,
	error500Handler,
} = require("./controllers/errorHandeling");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getAllComments);

app.get("/api/reviews/:review_id", getReviewsById);
app.patch("/api/reviews/:review_id", patchReview);

app.post("/api/reviews/:review_id/comments", postComments);
app.get("/api/users", getUsers);

app.all("*", (req, res, next) => {
	res.status(404).send({ msg: "Path not found" });
});
app.use(errorPSQLHandler);
app.use(handleCustomErrors);
app.use(error500Handler);

module.exports = app;
