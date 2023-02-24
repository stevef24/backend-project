const { getUsers, getUserByName } = require("../controllers/userController");
const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUserByName);

module.exports = userRouter;
