var axios = require('axios');
var models = require('../models');
module.exports = function(app) {
    app.post("/api/searchmovies", function (req, res) {
        var queryURL = "http://www.omdbapi.com/?apikey=" + process.env.OMDBAPIKEY + "&type=movie&s=" + req.body.searchParam
        axios
            .get(queryURL)
            .then(function(response) {
                res.json(response.data);
            })
            .catch(function(error) {
                console.error(error);
            })
    });

    app.post("/api/addusermovie", function (req, res) {
        models.Movies.findOne({
            where: {
                movieId: req.body.movieId,
                UserId: req.body.userId,
            }
        }).then(function(response) {
            if (response) {
                res.json({success: false}) //movie already exists for this user
            } else {
                models.Movies.create({
                    movieId: req.body.movieId,
                    UserId: req.body.userId,
                    moviePoster: req.body.moviePoster,
                    movieTitle: req.body.movieTitle
                }).then(function(resp) {
                    res.json({success: true});
                }).catch(function(error) {
                    res.json({success: false})
                });
            }
        });

    });

    app.post("/api/getusermovies", function(req, res) {
        models.Movies.findAll({
            where: {
                UserId: req.body.userId
            }
        }).then(function(response) {
            res.json(response);
        }).catch(function(error) {
            res.json({success: false});
        })
    })
}