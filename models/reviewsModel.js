const db = require("../db/connection");

exports.fetchReviews = (sort_by = "created_at", order, category) => {
	console.log(order);
	const paramsArr = [];
	const validCategories = [
		"euro game",
		"social deduction",
		"dexterity",
		`children's games`,
	];
	const validOrderArr = ["asc", "desc", undefined];
	const validSortBy = [
		"title",
		"designer",
		"owner",
		"review_img_url",
		"review_body",
		"category",
		"created_at",
		"votes",
		undefined,
	];
	const validCategory = validCategories.includes(category) ? true : false;
	const validOrder = validOrderArr.includes(order) ? true : false;
	const validSort = validSortBy.includes(sort_by) ? true : false;

	if (!validOrder) {
		return Promise.reject({
			status: 400,
			msg: "Bad request! invalid order parameter!",
		});
	}

	if (!validSort) {
		return Promise.reject({
			status: 400,
			msg: "Bad request! invalid sort parameter!",
		});
	}

	let defaultQuery = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
	FROM reviews
	LEFT JOIN comments ON reviews.review_id = comments.review_id`;
	if (category) {
		defaultQuery += ` WHERE category = $1
		GROUP BY reviews.review_id`;
		paramsArr.push(category);
	} else {
		defaultQuery += ` GROUP BY reviews.review_id`;
	}
	if (order) {
		defaultQuery += ` ORDER BY created_at ${order}`;
	} else if (sort_by) {
		defaultQuery += ` ORDER BY ${sort_by} DESC`;
	}

	return db.query(defaultQuery, paramsArr).then(({ rows }) => {
		if (!rows.length && !validCategory) {
			return Promise.reject({
				status: 400,
				msg: "Bad request! invalid category",
			});
		}

		return rows;
	});
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
};

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

exports.updateReview = (review_id, patchUpdates) => {
	const { inc_votes } = patchUpdates;
	return db
		.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: "Bad request!",
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
						`UPDATE reviews
											SET votes = votes + $1
											WHERE review_id =$2
											 RETURNING *`,
						[inc_votes, review_id]
					);
				})
				.then(({ rows }) => rows[0]);
		});
};

exports.newComment = (review_id, commentObj) => {
	const { body, author } = commentObj;
	if (!body || !author)
		return Promise.reject({
			status: 400,
			msg: "Body and author name must be valid!",
		});
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
			return db
				.query(`SELECT * FROM users where username = $1`, [author])
				.then(({ rows }) => {
					if (!rows.length) {
						return Promise.reject({
							status: 404,
							msg: `User does not exist`,
						});
					}
					return rows;
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

exports.fetchUsers = () => {
	return db.query(`SELECT * FROM USERS`).then(({ rows }) => rows);
};

exports.removeComment = (comment_id) => {
	return db
		.query(`DELETE FROM comments WHERE comment_id=$1 returning *`, [comment_id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: `comment does not exist`,
				});
			}
			return rows;
		});
};
