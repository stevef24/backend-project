const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/reviewsController");
const { updateComment } = require("../controllers/commentsController");

commentsRouter.route("/:comment_id").delete(deleteComment).patch(updateComment);
module.exports = commentsRouter;
