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
