const { fetchCategories, newCategory } = require("../models/categoriesModel");

exports.getCategories = (req, res, next) => {
	fetchCategories()
		.then((categories) => {
			res.status(200).send({ categories });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postCategory = (req, res, next) => {
	const createCategory = req.body;
	newCategory(createCategory)
		.then((category) => {
			res.status(201).send({ category });
		})
		.catch((err) => next(err));
};
