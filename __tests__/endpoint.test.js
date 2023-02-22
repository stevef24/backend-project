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
				expect(body).toHaveProperty(
					"msg",
					"No review found for review_id: 1000000"
				);
			});
	});
	it("404 error if the path give in invalid", () => {
		return request(app).get("/api/reviews/1000000").expect(404);
	});
});

describe("POST /api/reviews/:review_id/comments", () => {
	it("should return 201 and the posted data", () => {
		const data = {
			body: "hello world this is my code ",
			author: "mallionaire",
		};
		return request(app)
			.post("/api/reviews/2/comments")
			.send(data)
			.expect(201)
			.then(({ body }) => {
				expect(body.comments).toMatchObject({
					comment_id: expect.any(Number),
					body: "hello world this is my code ",
					review_id: 2,
					author: "mallionaire",
					votes: 0,
					created_at: expect.any(String),
				});
			});
	});
	it("404 error if given the correct path but the review does not exist", () => {
		const data = {
			body: "hello world this is my code ",
			author: "mallionaire",
		};
		return request(app)
			.post("/api/reviews/5000/comments")
			.send(data)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("No review found for review_id: 5000");
			});
	});
	it("get 400 bad request if the incorrect path has bee given ", () => {
		const data = {
			body: "hello world this is my code ",
			author: "mallionaire",
		};
		return request(app)
			.post("/api/reviews/hello/comments")
			.send(data)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	it("should respond with a 201 to check a new item has been created ignoring extra properties", () => {
		const data = {
			body: "hello world this is my code ",
			author: "mallionaire",
			votes: 5000,
		};
		return request(app)
			.post("/api/reviews/2/comments")
			.send(data)
			.expect(201)
			.then(({ body }) => {
				expect(body.comments).toMatchObject({
					comment_id: expect.any(Number),
					body: "hello world this is my code ",
					review_id: 2,
					author: "mallionaire",
					votes: 0,
					created_at: expect.any(String),
				});
			});
	});
	it("404 if the username does not exist ", () => {
		const data = {
			body: "hello world this is my code ",
			author: "stav123",
		};
		return request(app)
			.post("/api/reviews/2/comments")
			.send(data)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("User does not exist");
			});
	});
	it("400 for missing required field/s for example there is no username or body properties. ", () => {
		const data = {
			body: "hello world this is my code ",
		};
		return request(app)
			.post("/api/reviews/2/comments")
			.send(data)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request!");
			});
	});
});

});
``;

