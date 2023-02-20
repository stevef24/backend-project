const { fetchReviews } = require("../models/reviewsModel");
exports.getReviews = (req, res, next) => {
	fetchReviews()
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch((err) => [next(err)]);
};
