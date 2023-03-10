exports.errorPSQLHandler = (err, req, res, next) => {
	const errors = ["42703", "22P02"];
	if (errors.includes(err.code)) {
		res.status(400).send({ msg: "Bad request" });
	} else {
		next(err);
	}
};

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status === 400) {
		res.status(400).send({ err: err.msg });
	}
	if (err.status && err.msg) {
		res.status(404).send({ err: err.msg });
	} else {
		next(err);
	}
};

exports.error500Handler = (err, req, res, next) => {
	res.status(500).send({ msg: "Internal server error" });
};
