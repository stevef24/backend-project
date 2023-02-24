const {
	fetchReviews,
	fetchComments,
	fetchReviewsById,
	updateReview,
	newComment,
	fetchUsers,
	removeComment,
} = require("../models/reviewsModel");

exports.getReviews = (req, res, next) => {
	const { sort_by, order, category } = req.query;
	fetchReviews(sort_by, order, category)
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

exports.getAllComments = (req, res, next) => {
	const { review_id } = req.params;
	fetchComments(review_id)
		.then((data) => {
			res.status(200).send({ comments: data });
		})
		.catch((err) => next(err));
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

exports.getUsers = (req, res, next) => {
	fetchUsers()
		.then((data) => {
			res.status(200).send({ users: data });
		})
		.catch((err) => {
			next(err);
		});
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
