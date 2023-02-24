const { getCategories } = require("../controllers/categoriesController");
const categoryRouter = require("express").Router();

categoryRouter.route("/").get(getCategories);
module.exports = categoryRouter;
