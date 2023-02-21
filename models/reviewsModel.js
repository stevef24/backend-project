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
		.query(
			`SELECT * FROM comments 
			WHERE review_id = $1 
			ORDER BY created_at desc;`,
			[review_id]
		)
		.then(({ rows }) => rows);
};
