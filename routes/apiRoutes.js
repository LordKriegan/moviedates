var axios = require('axios');

module.exports = function(app) {
    app.post("/api/searchmovies", function (req, res) {
        var date = new Date();
        date = date.toISOString().split("T")[0];
        var queryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + date + "&lat=" + req.body.lat + "&lng=" + req.body.long + "&api_key=" + process.env.MOVIESEARCHAPIKEY
        axios
            .get(queryURL)
            .then(function(response) {
                res.json(response.data);
            })
            .catch(function(error) {
                console.error(error);
            })
    });
}