const db = require("../db/connection");

exports.fetchComments = (review_id) => {
	return db
		.query(
			`SELECT * FROM comments 
			WHERE review_id = $1 
			ORDER BY created_at desc;`,
			[review_id]
		)
		.then(({ rows }) => rows);
};

exports.patchComment = (comment_id, newVote) => {
	return db
		.query(
			`UPDATE comments
	SET votes = votes + $1
	WHERE comment_id =$2
	 RETURNING *`,
			[newVote, comment_id]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: "comment does not exist!" });
			}
			return rows[0];
		});
};
