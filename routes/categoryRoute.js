const {
	getCategories,
	postCategory,
} = require("../controllers/categoriesController");
const categoryRouter = require("express").Router();

categoryRouter.route("/").get(getCategories).post(postCategory);
module.exports = categoryRouter;
