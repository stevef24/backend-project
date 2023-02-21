const { fetchReviews, fetchComments } = require("../models/reviewsModel");
exports.getReviews = (req, res, next) => {
	fetchReviews()
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch((err) => [next(err)]);
};

exports.getAllComments = (req, res, next) => {
	const { review_id } = req.params;
	fetchComments(review_id)
		.then((data) => {
			// console.log(data);
			res.status(200).send({ comments: data });
		})
		.catch((err) => next(err));
};
