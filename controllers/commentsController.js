const { fetchComments, patchComment } = require("../models/commentsModel");

exports.getAllComments = (req, res, next) => {
	const { review_id } = req.params;
	fetchComments(review_id)
		.then((data) => {
			res.status(200).send({ comments: data });
		})
		.catch((err) => next(err));
};

exports.updateComment = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	patchComment(comment_id, inc_votes)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch((err) => next(err));
};
