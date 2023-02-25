const reviewRouter = require("express").Router();
const {
	getReviews,
	getReviewsById,
	patchReview,
	postComments,
} = require("../controllers/reviewsController");
const { getAllComments } = require("../controllers/commentsController");
reviewRouter.route("/").get(getReviews);

reviewRouter.route("/:review_id").get(getReviewsById).patch(patchReview);

reviewRouter
	.route("/:review_id/comments")
	.get(getAllComments)
	.post(postComments);

module.exports = reviewRouter;
