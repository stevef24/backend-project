const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categoriesControllers");
const endpoints = require("./endpoints.json");
const { getUsers, deleteComment } = require("./controllers/reviewsController");
const reviewRouter = require("./routes/reviewsRoute");
const commentsRouter = require("./routes/commentsRoute");
const userRouter = require("./routes/userRoute");
const categoryRouter = require("./routes/categoryRoute");

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
app.use("/api/comments", commentsRouter);
app.get("/api/categories", getCategories);
app.get("/api/users", getUsers);

app.use(errorPSQLHandler);
app.use(handleCustomErrors);
app.use(error500Handler);

app.all("*", (req, res, next) => {
	res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
