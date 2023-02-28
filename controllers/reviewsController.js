const {
	fetchReviews,
	fetchReviewsById,
	updateReview,
	newComment,
	removeComment,
	newReview,
} = require("../models/reviewsModel");

exports.getReviews = (req, res, next) => {
	const { sort_by, order, category, limit, page } = req.query;
	fetchReviews(sort_by, order, category, limit, page)
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

exports.postComments = (req, res, next) => {
	const { review_id } = req.params;
	const commentObj = req.body;
	newComment(review_id, commentObj)
		.then((data) => {
			res.status(201).send({ comments: data });
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchReview = (req, res, next) => {
	const { review_id } = req.params;
	const updates = req.body;
	updateReview(review_id, updates)
		.then((data) => {
			res.status(200).send({ review: data });
		})
		.catch((err) => next(err));
};

exports.deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	removeComment(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};

exports.postReviews = (req, res, next) => {
	const post = req.body;
	newReview(post)
		.then((review) => {
			res.status(201).send({ review: { ...review, comment_count: 0 } });
		})
		.catch((err) => next(err));
};
