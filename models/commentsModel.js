const db = require("../db/connection");

exports.fetchComments = (review_id, limit = 10, pages = 1) => {
	const offset = (pages - 1) * limit;
	limit = Math.min(limit, 10);
	return db
		.query(
			`SELECT * FROM reviews
	WHERE review_id = $1`,
			[review_id]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: "review is not available!" });
			}
		})
		.then((rows) => {
			return db.query(
				`SELECT * FROM comments
		WHERE review_id = $1
		ORDER BY created_at desc
		LIMIT $2 OFFSET $3`,
				[review_id, limit, offset]
			);
		})
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.resolve({
					status: 200,
					msg: "No comments for this reviews at this time, be the first to add one!",
				});
			}
			return rows;
		});
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
