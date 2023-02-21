exports.errorPSQLHandler = (err, req, res, next) => {
	const errors = ["42703", "22P02"];
	if (errors.includes(err.code)) {
		res.status(400).send({ msg: "Bad request" });
	} else {
		next(err);
	}
};
exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};
exports.error500Handler = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Internal server error" });
};
