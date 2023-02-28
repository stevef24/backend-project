const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endPoints = require("../endpoints");

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
				expect(reviews.length).toBe(10);
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
				expect(reviews.length).toBe(10);
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
	describe("GET /api/reviews (queries)", () => {
		it("return 200 with the reviews sorted by designer", () => {
			return request(app)
				.get("/api/reviews?sort_by=designer")
				.expect(200)
				.then(({ body }) => {
					const reviews = body.reviews;
					expect(reviews).toBeSortedBy("designer", { descending: true });
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
		it("return 400  when order isn't valid ie orders = hithere ", () => {
			return request(app)
				.get("/api/reviews?order=hithere")
				.expect(400)
				.then(({ body }) => {
					expect(body.err).toBe("Bad request! invalid order parameter!");
				});
		});
		it("return 200 with the reviews order in ascending order ", () => {
			return request(app)
				.get("/api/reviews?order=asc")
				.expect(200)
				.then(({ body }) => {
					const reviews = body.reviews;
					expect(reviews).toBeSortedBy("created_at", { ascending: true });
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
		it("return 200 with the reviews categorised by dexterity ", () => {
			return request(app)
				.get("/api/reviews?category=dexterity")
				.expect(200)
				.then(({ body }) => {
					const reviews = body.reviews;
					expect(reviews).toBeSortedBy("category", { ascending: true });
					reviews.forEach((review) => {
						expect(review).toHaveProperty("owner", expect.any(String));
						expect(review).toHaveProperty("title", expect.any(String));
						expect(review).toHaveProperty("review_id", expect.any(Number));
						expect(review).toHaveProperty("category", "dexterity");
						expect(review).toHaveProperty("review_img_url", expect.any(String));
						expect(review).toHaveProperty("created_at", expect.any(String));
						expect(review).toHaveProperty("designer", expect.any(String));
						expect(review).toHaveProperty("votes", expect.any(Number));
						expect(review).toHaveProperty("comment_count", expect.any(String));
					});
				});
		});
		it("return a 400 Not found when given an correct path with incorrect field ie category = hello  ", () => {
			return request(app)
				.get("/api/reviews?category=hello")
				.expect(400)
				.then(({ body }) => {
					expect(body.err).toBe("Bad request! invalid category");
				});
		});
		it(" 200 response for a valid category with no reviews yet", () => {
			return request(app)
				.get("/api/reviews?category=children's%20games")
				.expect(200);
		});
		it("200 response for a limit of 10 objects returning", () => {
			return request(app)
				.get("/api/reviews?order=asc&limit=10&page=1")
				.expect(200)
				.then(({ body }) => {
					const reviews = body.reviews;
					expect(reviews).toBeSortedBy("created_at", { ascending: true });
					expect(reviews).toHaveLength(10);
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
		it(" 200 response for a the remaining objects in page 2, length should equal 3 ", () => {
			return request(app)
				.get("/api/reviews?order=asc&limit=10&page=2")
				.expect(200)
				.then(({ body }) => {
					const reviews = body.reviews;
					expect(reviews).toBeSortedBy("created_at", { ascending: true });
					expect(reviews).toHaveLength(3);
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
				expect(reviewObj).toHaveProperty("comment_count", "3");
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
				expect(body.err).toBe("No review found for review_id: 5000");
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
				expect(body.err).toBe("User does not exist");
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
				expect(body.err).toBe("Body and author name must be valid!");
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
	it("should return a 200 response when changes are made but it ignores other property ", () => {
		const updatedData = { inc_votes: 5, title: "hello world" };
		return request(app)
			.patch("/api/reviews/2")
			.send(updatedData)
			.expect(200)
			.then(({ body }) => {
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

describe("GET /api/users", () => {
	it("respond with a 200 and contain all the data with the right property ", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const users = body.users;
				users.forEach((user) => {
					expect(user).toHaveProperty("username", expect.any(String));
					expect(user).toHaveProperty("name", expect.any(String));
					expect(user).toHaveProperty("avatar_url", expect.any(String));
				});
			});
	});
	it("respond with a 404 if given wrong path", () => {
		return request(app).get("/api/usersss").expect(404);
	});
});

describe(`DELETE /api/comments/:comment_id`, () => {
	it("delete the given comment by comment_id and respond with 204", () => {
		return request(app).delete("/api/comments/2").expect(204);
	});
	it("returns 404 if the comment deleted doesn't exist ", () => {
		return request(app)
			.delete("/api/comments/10000")
			.expect(404)
			.then(({ body }) => {
				expect(body.err).toBe(`comment does not exist`);
			});
	});
	it("returns 400 if the comment path is correct but has invalid inout ie id = banana ", () => {
		return request(app)
			.delete("/api/comments/banana")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe(`Bad request`);
			});
	});
});

describe("GET /api", () => {
	it("responds with 200 and JSON describing all the available endpoints in this API ", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.endpoints).toEqual(endPoints);
			});
	});
});

describe("GET /api/users/:username", () => {
	it("respond with a 200 and return user object with the correct data", () => {
		return request(app)
			.get("/api/users/mallionaire")
			.expect(200)
			.then(({ body }) => {
				const user = body.user;
				expect(user).toHaveProperty("username");
				expect(user).toHaveProperty("avatar_url");
				expect(user).toHaveProperty("name");
			});
	});
	it("400 if given the correct path but has wrong input ie username =1", () => {
		return request(app)
			.get("/api/users/1")
			.expect(400)
			.then(({ body }) => {
				expect(body.err).toBe(`Bad request`);
			});
	});
});

describe("PATCH /api/comments/:comment_id", () => {
	it("should return a 200 with the updated votes property, ignoring all other properties ", () => {
		const updateVotes = { inc_votes: 5 };
		return request(app)
			.patch("/api/comments/2")
			.send(updateVotes)
			.expect(200)
			.then(({ body }) => {
				expect(body.comment).toHaveProperty("comment_id", 2);
				expect(body.comment).toHaveProperty(
					"body",
					"My dog loved this game too!"
				);
				expect(body.comment).toHaveProperty("author", "mallionaire");
				expect(body.comment).toHaveProperty("votes", 18);
				expect(body.comment).toHaveProperty(
					"created_at",
					"2021-01-18T10:09:05.410Z"
				);
			});
	});
	it("return a 400 Bad Request if the path given is correct but the input is invalid ie /api/comments/banana", () => {
		const updateVotes = { inc_votes: 5 };
		return request(app)
			.patch("/api/comments/banana")
			.send(updateVotes)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	it("return a 404 if the comment does not exist ie comment id = 101010", () => {
		const updateVotes = { inc_votes: 5 };
		return request(app)
			.patch("/api/comments/101010")
			.send(updateVotes)
			.expect(404)
			.then(({ body }) => {
				expect(body.err).toBe("comment does not exist!");
			});
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
					expect(comment).toHaveProperty("review_id", 2);
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
	it("should responds with 404 where a review does not exist  ", () => {
		return request(app)
			.get("/api/reviews/500/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.err).toBe("review is not available!");
			});
	});
	it("should responds with 200 for a review with no comments ", () => {
		return request(app)
			.get("/api/reviews/5/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments.msg).toBe(
					"No comments for this reviews at this time, be the first to add one!"
				);
			});
	});
	it("should responds with 200 with a limit of 2 per page ", () => {
		return request(app)
			.get("/api/reviews/2/comments?limit=2&pages=1")
			.expect(200)
			.then(({ body }) => {
				const comments = body.comments;
				expect(comments).toHaveLength(2);
				comments.forEach((comment) => {
					expect(comment).toHaveProperty("comment_id", expect.any(Number));
					expect(comment).toHaveProperty("body", expect.any(String));
					expect(comment).toHaveProperty("review_id", 2);
					expect(comment).toHaveProperty("author", expect.any(String));
					expect(comment).toHaveProperty("votes", expect.any(Number));
					expect(comment).toHaveProperty("created_at", expect.any(String));
				});
				expect(comments).toBeSortedBy("created_at", { descending: true });
			});
	});
});

describe(`POST /api/categories`, () => {
	it("should return a 201 created with the correct object details that were created", () => {
		const newCategory = {
			slug: "sports",
			description:
				"Sports gaming is a category of video games that simulate various sports and allow players to compete against each other or against computer-controlled opponents. These games typically feature realistic graphics, physics, and gameplay mechanics that aim to replicate the experience of playing a real sport",
		};
		return request(app)
			.post("/api/categories")
			.send(newCategory)
			.expect(201)
			.then(({ body }) => {
				const category = body.category;
				expect(category).toHaveProperty("slug", "sports");
				expect(category).toHaveProperty(
					"description",
					"Sports gaming is a category of video games that simulate various sports and allow players to compete against each other or against computer-controlled opponents. These games typically feature realistic graphics, physics, and gameplay mechanics that aim to replicate the experience of playing a real sport"
				);
			});
	});
	it("should return a 400 if the user is trying to insert a category that already exists", () => {
		const newCategory = {
			slug: "euro game",
			description: "Abstact games that involve little luck",
		};
		return request(app)
			.post("/api/categories")
			.send(newCategory)
			.expect(400)
			.then(({ body }) => {
				expect(body.err).toBe("The category already exists!");
			});
	});
	it("should return a 404 bad request if the user does not send the post with the correct details ", () => {
		const newCategory = {
			hello: "euro game",
			there: 123223232,
		};
		return request(app)
			.post("/api/categories")
			.send(newCategory)
			.expect(404)
			.then(({ body }) => {
				expect(body.err).toBe("Bad Request!");
			});
	});
});

describe("DELETE /api/reviews/:review_id", () => {
	it("delete the given review by review_id and respond with 204", () => {
		return request(app).delete("/api/reviews/2").expect(204);
	});
	it("returns 404 if the review deleted doesn't exist ", () => {
		return request(app)
			.delete("/api/reviews/10000")
			.expect(404)
			.then(({ body }) => {
				expect(body.err).toBe(`review does not exist`);
			});
	});
	it("returns 400 if the review path is correct but has invalid inout ie id = banana ", () => {
		return request(app)
			.delete("/api/reviews/banana")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe(`Bad request`);
			});
	});
});
