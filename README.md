in order to the run the project locally you must create two .env files, before creating the files install dotenv (should be already in the package.json however ensure its installed by running npm i dotenv ), once installed create two new .env files:

1).env.test - in this file connect to the db by using PGDATABASE=nc_games_test
2).env.development - in this file connect to the db by using PGDATABASE=nc_games
