const db = require("../db/connection");

exports.fetchUsers = () => {
	return db.query(`SELECT * FROM USERS`).then(({ rows }) => rows);
};

exports.fetchUserByName = (username) => {
	return db
		.query(`SELECT * FROM USERS WHERE username= $1`, [username])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 400, msg: "Bad request" });
			}
			return rows[0];
		});
};
