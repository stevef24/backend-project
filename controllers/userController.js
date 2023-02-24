const { fetchUsers, fetchUserByName } = require("../models/userModel");

exports.getUsers = (req, res, next) => {
	fetchUsers()
		.then((data) => {
			res.status(200).send({ users: data });
		})
		.catch((err) => next(err));
};

exports.getUserByName = (req, res, next) => {
	const { username } = req.params;
	fetchUserByName(username)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};
