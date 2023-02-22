const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	return db.end();
});

describe("GET /api/categories", () => {
	it("respond with a 200", () => {
		return request(app).get("/api/categories").expect(200);
	});
	it("should return an array of categories with the correct information  ", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then(({ body }) => {
				const categories = body.categories;
				categories.forEach((category) => {
					expect(category).toHaveProperty("slug", expect.any(String));
					expect(category).toHaveProperty("description", expect.any(String));
				});
			});
	});
	it("404 response with bad request when give invalid endpoint ", () => {
		return request(app).get("/api/categoriesasd").expect(404);
	});
});

describe("GET /api/reviews", () => {
	it("should return 200 ", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const reviews = body.reviews;
				expect(reviews.length).toBe(13);
				expect(reviews).toBeSortedBy("created_at", { descending: true });
				reviews.forEach((review) => {
					expect(review).toHaveProperty("owner", expect.any(String));
					expect(review).toHaveProperty("title", expect.any(String));
					expect(review).toHaveProperty("review_id", expect.any(Number));
					expect(review).toHaveProperty("category", expect.any(String));
					expect(review).toHaveProperty("review_img_url", expect.any(String));
					expect(review).toHaveProperty("created_at", expect.any(String));
					expect(review).toHaveProperty("designer", expect.any(String));
					expect(review).toHaveProperty("votes", expect.any(Number));
					expect(review).toHaveProperty("comment_count", expect.any(String));
				});
			});
	});
	it("should return the correct data from the request", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const reviews = body.reviews;
				expect(reviews.length).toBe(13);
				expect(reviews).toBeSortedBy("created_at", { descending: true });

				reviews.forEach((review) => {
					expect(review).toHaveProperty("owner", expect.any(String));
					expect(review).toHaveProperty("title", expect.any(String));
					expect(review).toHaveProperty("review_id", expect.any(Number));
					expect(review).toHaveProperty("category", expect.any(String));
					expect(review).toHaveProperty("review_img_url", expect.any(String));
					expect(review).toHaveProperty("created_at", expect.any(String));
					expect(review).toHaveProperty("designer", expect.any(String));
					expect(review).toHaveProperty("votes", expect.any(Number));
					expect(review).toHaveProperty("comment_count", expect.any(String));
				});
			});
	});
	it("404 err if the url path is incorrect", () => {
		return request(app).get("/api/reviewsas").expect(404);
	});
	it("404 err if the url path is correct but the user doesn't exist ", () => {
		return request(app).get("/api/10000").expect(404);
	});
});

describe("GET /api/reviews/:review_id", () => {
	it("should respond with  a 200 response and the correct details  ", () => {
		return request(app)
			.get("/api/reviews/2")
			.expect(200)
			.then(({ body }) => {
				const review = body.review;
				expect(review.length).toBe(1);
				const reviewObj = body.review[0];
				expect(reviewObj).toHaveProperty("review_id", 2);
				expect(reviewObj).toHaveProperty("title", "Jenga");
				expect(reviewObj).toHaveProperty("category");
				expect(reviewObj).toHaveProperty("designer", "Leslie Scott");
				expect(reviewObj).toHaveProperty("owner", "philippaclaire9");
				expect(reviewObj).toHaveProperty(
					"review_body",
					"Fiddly fun for all the family"
				);
				expect(reviewObj).toHaveProperty(
					"review_img_url",
					"https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
				);
				expect(reviewObj).toHaveProperty(
					"created_at",
					"2021-01-18T10:01:41.251Z"
				);
				expect(reviewObj).toHaveProperty("votes", 5);
			});
	});
	it("404 error if the ID is invalid", () => {
		return request(app)
			.get("/api/reviews/1000000")
			.expect(404)
			.then(({ body }) => {
				expect(body.err).toBe("No review found for review_id: 1000000");
			});
	});
	it("404 error if the path give in invalid", () => {
		return request(app).get("/api/reviews/1000000").expect(404);
	});
});

describe(`GET /api/reviews/:review_id/comments`, () => {
	it("return a 200 request and the data in the correct order ", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then(({ body }) => {
				const comments = body.comments;
				expect(comments).toHaveLength(3);
				comments.forEach((comment) => {
					expect(comment).toHaveProperty("comment_id", expect.any(Number));
					expect(comment).toHaveProperty("body", expect.any(String));
					expect(comment).toHaveProperty("review_id", expect.any(Number));
					expect(comment).toHaveProperty("author", expect.any(String));
					expect(comment).toHaveProperty("votes", expect.any(Number));
					expect(comment).toHaveProperty("created_at", expect.any(String));
				});
				expect(comments).toBeSortedBy("created_at", { descending: true });
			});
	});
	it("404 Error if given the wrong path", () => {
		return request(app).get("/api/banana/:review_id/comments").expect(404);
	});
	it("should responds with 400 for a non id string eg get /api/reviews/hello/comments ", () => {
		return request(app)
			.get("/api/reviews/hello/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});

describe("PATCH /api/reviews/:review_id", () => {
	it("should return a 200 with the correct properties  ", () => {
		const updatedData = { inc_votes: 5 };
		return request(app)
			.patch("/api/reviews/2")
			.send(updatedData)
			.expect(200)
			.then(({ body }) => {
				const review = body.review;
				expect(review).toHaveProperty("review_id", 2);
				expect(review).toHaveProperty("title", expect.any(String));
				expect(review).toHaveProperty("category", expect.any(String));
				expect(review).toHaveProperty("designer", expect.any(String));
				expect(review).toHaveProperty("owner", expect.any(String));
				expect(review).toHaveProperty("review_body", expect.any(String));
				expect(review).toHaveProperty("review_img_url", expect.any(String));
				expect(review).toHaveProperty("created_at", expect.any(String));
				expect(review).toHaveProperty("votes", 10);
			});
	});
	it("should return an updated value of the vote property  ", () => {
		const updatedData = { inc_votes: 100 };
		return request(app)
			.patch("/api/reviews/2")
			.send(updatedData)
			.expect(200)
			.then(({ body }) => {
				expect(body.review).toHaveProperty("votes", 105);
			});
	});
	it("should return a 400 for a request that the correct path but wrong inputs", () => {
		const updatedData = { inc_votes: 5 };
		return request(app)
			.patch("/api/reviews/hello")
			.send(updatedData)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	it("should return a 404 if the review does not exist ", () => {
		const updatedData = { inc_votes: 5 };
		return request(app)
			.patch("/api/reviews/999999")
			.send(updatedData)
			.expect(404)
			.then(({ body }) => {
				expect(body.err).toBe("Bad request!");
			});
	});
	it("should return a 201 response when changes are made but it ignores other property ", () => {
		const updatedData = { inc_votes: 5, title: "hello world" };
		return request(app)
			.patch("/api/reviews/2")
			.send(updatedData)
			.expect(200)
			.then(({ body }) => {
				console.log(body);
				const review = body.review;
				expect(review).toHaveProperty("review_id", 2);
				expect(review).toHaveProperty("title", "Jenga");
				expect(review).toHaveProperty("category", "dexterity");
				expect(review).toHaveProperty("designer", "Leslie Scott");
				expect(review).toHaveProperty("owner", "philippaclaire9");
				expect(review).toHaveProperty(
					"review_body",
					"Fiddly fun for all the family"
				);
				expect(review).toHaveProperty(
					"review_img_url",
					"https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
				);
				expect(review).toHaveProperty("created_at", "2021-01-18T10:01:41.251Z");
				expect(review).toHaveProperty("votes", 10);
			});
	});
	it("should return a 400 response when changes are made but it ignores other property ", () => {
		const updatedData = { inc_votes: "hello" };
		return request(app)
			.patch("/api/reviews/2")
			.send(updatedData)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});
