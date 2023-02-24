const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesControllers");
const endpoints = require("./endpoints.json");
const { getUsers, deleteComment } = require("./controllers/reviewsController");
const reviewRouter = require("./routes/reviewsRouter");
const {
	errorPSQLHandler,
	handleCustomErrors,
	error500Handler,
} = require("./controllers/errorHandeling");

app.get("/api", (req, res, next) => {
	res.status(200).send({ endpoints });
});

app.use(express.json());
app.use("/api/reviews", reviewRouter);
app.get("/api/categories", getCategories);
app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(errorPSQLHandler);
app.use(handleCustomErrors);
app.use(error500Handler);

app.all("*", (req, res, next) => {
	res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
