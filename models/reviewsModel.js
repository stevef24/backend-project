const db = require("../db/connection");

exports.fetchReviews = () => {
	return db
		.query(
			`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`
		)
		.then(({ rows }) => rows);
};


exports.fetchComments = (review_id) => {
	return db
		.query(`SELECT * FROM reviews WHERE review_id=$1 `, [review_id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: `Cannot find review ${review_id}`,
				});
			}
			return db.query(
				`SELECT * FROM comments 
			WHERE review_id = $1 
			ORDER BY created_at desc;`,
				[review_id]
			);
		})
		.then(({ rows }) => rows);

exports.fetchReviewsById = (reviewId) => {
	return db
		.query(
			`SELECT * FROM reviews 
				WHERE review_id=$1;`,
			[reviewId]
		)
		.then(({ rows }) => {
			return rows.length === 0
				? Promise.reject({
						status: 404,
						msg: `No review found for review_id: ${reviewId}`,
				  })
				: rows;
		});

};

exports.newComment = (review_id, commentObj) => {
	console.log(commentObj);
	const { body, author } = commentObj;
	if (!body || !author)
		return Promise.reject({
			status: 400,
			msg: "Bad request!",
		});
	return db
		.query(`SELECT * FROM users where username = $1`, [author])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: "User does not exist",
				});
			}
		})
		.then(() => {
			return db
				.query(`SELECT * FROM reviews WHERE review_id= $1`, [review_id])
				.then(({ rows }) => {
					if (!rows.length) {
						return Promise.reject({
							status: 404,
							msg: `No review found for review_id: ${review_id}`,
						});
					}
				})
				.then(() => {
					return db.query(
						`INSERT INTO comments (body, author, review_id)
						VALUES ($1, $2, $3)
						RETURNING *;`,
						[body, author, review_id]
					);
				})
				.then(({ rows }) => rows[0]);
		});
};
