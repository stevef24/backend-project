const db = require("../db/connection");

exports.fetchCategories = () => {
	return db.query(`SELECT * FROM categories`).then(({ rows }) => rows);
};

exports.newCategory = ({ slug, description }) => {
	if (slug === undefined || description === undefined) {
		return Promise.reject({ status: 404, msg: "Bad Request!" });
	}
	return db
		.query(`SELECT * FROM categories WHERE slug = $1`, [slug])
		.then(({ rows }) => {
			if (rows.length > 0) {
				return Promise.reject({
					status: 400,
					msg: "The category already exists!",
				});
			}
			return rows;
		})
		.then(() => {
			return db.query(
				`INSERT INTO categories (slug, description)
				VALUES ($1, $2)
				RETURNING *`,
				[slug, description]
			);
		})
		.then(({ rows }) => {
			if (!rows.length) {
				Promise.reject({ status: 400, msg: "Invalid category input" });
			}
			return rows[0];
		});
};
