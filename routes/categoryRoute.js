const { getCategories } = require("../controllers/categoriesControllers");
const categoryRouter = require("express").Router();

categoryRouter.route("/").get(getCategories);
module.exports = categoryRouter;
