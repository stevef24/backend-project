const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { toBeSorted, toBeSortedBy } = require("jest-sorted");

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
				console.log(reviews, "<-----------");
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
});
