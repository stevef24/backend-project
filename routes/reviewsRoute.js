const reviewRouter = require("express").Router();
const {
	getReviews,
	getReviewsById,
	patchReview,
	postComments,
	deleteReview,
} = require("../controllers/reviewsController");
const { getAllComments } = require("../controllers/commentsController");
reviewRouter.route("/").get(getReviews);

reviewRouter
	.route("/:review_id")
	.get(getReviewsById)
	.patch(patchReview)
	.delete(deleteReview);

reviewRouter
	.route("/:review_id/comments")
	.get(getAllComments)
	.post(postComments);

module.exports = reviewRouter;
