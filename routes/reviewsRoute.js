const reviewRouter = require("express").Router();
const {
	getReviews,
	getAllComments,
	getReviewsById,
	patchReview,
	postComments,
} = require("../controllers/reviewsController");

reviewRouter.route("/").get(getReviews);

reviewRouter.route("/:review_id").get(getReviewsById).patch(patchReview);

reviewRouter
	.route("/:review_id/comments")
	.get(getAllComments)
	.post(postComments);

module.exports = reviewRouter;
