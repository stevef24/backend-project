const { fetchReviews, fetchReviewsById } = require("../models/reviewsModel");

exports.getReviews = (req, res, next) => {
	fetchReviews()
		.then((review) => {
			res.status(200).send({ reviews: review });
		})
		.catch((err) => next(err));
};

exports.getReviewsById = (req, res, next) => {
	const { review_id } = req.params;
	fetchReviewsById(review_id)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch((err) => next(err));
};
