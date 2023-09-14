const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

const app = express();
app.use(express.json())

let db = null;
const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");

        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }

};

initializeDbAndServer();

//1 Get Movies
app.get("/movies/", async (request, response) => {
    const getMoviesQurey = `SELECT * FROM movie 
    ORDER BY movie_id;`;
    const getMovieArray = await db.all(getMoviesQurey);
    response.send(getMovieArray.map((eachMovie) => ({
        movieName: eachMovie.movie_name,

    })

    ));
});

//2 Add Movie Query 
app.post("/movies/", async (request, response) => {
    const movieDetails = request.body;
    const { directorId,
        movieName,
        leadActor } = movieDetails;
    const addMovieQuery = `INSERT INTO movie
    (direcor_id,movie_name,lead_actor)
        VALUES
        (${directorId},'${movieName}','${leadActor}');`;
    const movie = await db.run(addMovieQuery);
    directorId = dbResponse.lastId;
    response.send("Movie Successfully Added");

});

//3 Get Movie based on Movie Id
app.get("/movies/:movieId", async (request, response) => {
    const getMovieQurey = `SELECT * FORM movie WHERE movie_id = ${movieId};`;
    const moviesArray = await db.get(getMovieQurey);
    response.send(moviesArray);
});

//4 Update movies
app.put("/movies/:movieId", async (request, response) => {
    const { movieId } = request.params;
    const movieDetails = request.body;
    const { directorId, movieName, leadActor } = movieDetails;
    const updateMovieQuery = `UPDAE movie 
    SET 
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE movie_id = ${movieId};`;
    await db.run(updateMovieQuery);
    response.send("Movie Details Updated");
});

//5 Delete Movie
app.delete("/movies/:movieId", async (request, response) => {
    const { movieId } = request.params;
    const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
    await db.run(deleteMovieQuery);
    response.send("Movie Removed");

});

//6 Get All Directors
app.get("/direcors/", async (request, response) => {
    const getDirectorsQuery = `SELECT * FROM directors ORDER BY director_id;`;
    const directorArray = await db.all(getDirectorsQuery);
    response.send(directorArray);
});

//7 Get All Movies by respective director
app.get("/directors/:directorId/movies", async (request, response) => {
    const { directorId } = request.params;
    const getDirectorsQurery = `SELECT * FROM director WHERE director_id = ${directorId};`;
    const directorsArray = await db.all(getDirectorsQurery);
    response.send(directorsArray);
});

module.exports = app;



