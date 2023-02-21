exports.errorPSQLHandler = (err, res, req, next) => {
	const errors = ["42703", "22P02"];
	if (errors.includes(err.code)) {
		res.status(400).send({ msg: "Bad request" });
	} else {
		next(err);
	}
};
exports.handleCustomErrors = (err, res, req, next) => {
	if (err.status === 404) {
		res.status(404).send({ msg: "cannot find the requested URL" });
	} else {
		next(err);
	}
};
exports.error500Handler = (err, res, req, next) => {
	res.status(500).send({ msg: "Internal server error" });
};
