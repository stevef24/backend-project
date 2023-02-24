Project summary:

Based on the provided endpoints, this API serves as a backend for a game review website. Here's a summary of what each endpoint does:

GET /api: Serves up a JSON representation of all the available endpoints of the API.
GET /api/categories: Serves an array of all categories.
GET /api/reviews: Serves an array of all reviews, with optional query parameters to filter and sort the results.
GET /api/reviews/:review_id/comments: Serves an array of all comments from a specific review ID.
GET /api/reviews/:review_id: Serves an array of all reviews from a specific review ID.
PATCH /api/reviews/:review_id: Updates the vote count for a specific review.
POST /api/reviews/:review_id/comments: Creates a new comment for a specific review.
GET /api/users: Serves an array of all users.
DELETE /api/comments/:comment_id: Deletes a unique comment based on its ID.
Overall, this API provides functionality to retrieve, create, update, and delete reviews, comments, and categories, as well as user data. The endpoints that serve reviews and comments also support filtering and sorting by category, vote count, and other parameters.

---

in order to the run the project locally you must create two .env files, before creating the files install dotenv (should be already in the package.json however ensure its installed by running npm i dotenv ), once installed create two new .env files:

1).env.test - in this file connect to the db by using PGDATABASE=nc_games_test
2).env.development - in this file connect to the db by using PGDATABASE=nc_games

---

the minimum requirements to run the project is to have node js and postgres with the versions below:
-- postgres 8.7.3
-- Node v18.12.1.

Project setup :

To clone a git repository, follow these steps:

1. Open a terminal or command prompt on your computer.

2. Navigate to the directory where you want to clone the repository.

git clone https://github.com/stevef24/backend-project

3. Press Enter. Git will now download a copy of the repository to your computer. Depending on the size of the repository and your internet connection speed, this may take a few moments.

4. Once the cloning process is complete, you will have a local copy of the repository on your computer that you can work with.

5. to install dependencies run npm i in your terminal in the root project path

---

seeding :

1. run npm run setup-dbs
2. npm run seed - this should populate the tables with data

running tests:
run npm t to run tests - the tests are located in the file named endpoints.tests.js

---

hosted version:
