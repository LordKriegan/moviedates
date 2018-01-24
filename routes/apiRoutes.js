var axios = require('axios');
var models = require('../models');
var firebase = require('firebase');
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCZu2Sj0p2tF2Zs4dSQZqIynXpPNn7SL-Q",
    authDomain: "movidate-1516684495286.firebaseapp.com",
    databaseURL: "https://movidate-1516684495286.firebaseio.com",
    projectId: "movidate-1516684495286",
    storageBucket: "movidate-1516684495286.appspot.com",
    messagingSenderId: "29543976787"
};
firebase.initializeApp(config);
fbdb = firebase.database();

module.exports = function (app) {
    app.post("/api/searchmovies", function (req, res) {
        var queryURL = "http://www.omdbapi.com/?apikey=" + process.env.OMDBAPIKEY + "&type=movie&s=" + req.body.searchParam
        axios
            .get(queryURL)
            .then(function (response) {
                res.json(response.data);
            })
            .catch(function (error) {
                console.error(error);
            })
    });
    app.post("/api/getchatlist", function (req, res) {
        models.UserChats.findAll({
            where: {
                UserId: req.body.userId
            }
        }).then(function(response) {
            var results = [];
            var i = 0;
            function getRecieverName() {
                if (i < response.length) {
                    models.User.findOne({
                        where: {
                            id: response[i].reciever
                        }
                    }).then(function(recursiveResponse) {
                        if (recursiveResponse) {
                            results.push({
                                chatID: response[i].chatID,
                                reciever: recursiveResponse.email.split("@")[0],
                                profilePic: recursiveResponse.profilePic
                            });
                        }
                        i++;
                        getRecieverName();
                    }).catch(function(error) {
                        console.error(error);
                    });
                } else {
                    res.json(results);
                }
            }
            getRecieverName();
        }).catch(function(error) {
            console.error(error);
        })
    });
    app.post("/api/startnewchat", function (req, res) {
        models.UserChats.findOne({
            where: {
                UserId: req.body.userOne,
                reciever: req.body.userTwo
            }
        }).then(function(response) {
            console.log(response);
            if (response) {
                res.json({success: false, error: "chatroom already exists" }) //chat already exists
            } else {
                fbdb
                    .ref("chatrooms")
                    .push()
                    .then(function(snapshot) {
                        models.UserChats.create({
                            chatID: snapshot.key,
                            UserId: req.body.userOne,
                            reciever: req.body.userTwo
                        }).then(function(respOne) {
                            models.UserChats.create({
                                chatID: snapshot.key,
                                UserId: req.body.userTwo,
                                reciever: req.body.userOne
                            }).then(function(respTwo) {
                                res.json({success: true})
                            }).catch(function(error) {
                                console.error(error);
                                res.json({success: false})
                            })
                        }).catch(function(error) {
                            console.error(error);
                            res.json({success: false})
                        })
                    });  
            }
        }).catch(function(error) {
            console.error(error);
            res.json({success: false})
        })
    });
    app.post("/api/addusermovie", function (req, res) {
        models.Movies.findOne({
            where: {
                movieId: req.body.movieId,
                UserId: req.body.userId,
            }
        }).then(function (response) {
            if (response) {
                res.json({ success: false }) //movie already exists for this user
            } else {
                models.Movies.create({
                    movieId: req.body.movieId,
                    UserId: req.body.userId,
                    moviePoster: req.body.moviePoster,
                    movieTitle: req.body.movieTitle
                }).then(function (resp) {
                    res.json({ success: true });
                }).catch(function (error) {
                    res.json({ success: false })
                });
            }
        });

    });

    app.post("/api/getusermovies", function (req, res) {
        models.Movies.findAll({
            where: {
                UserId: req.body.userId
            }
        }).then(function (response) {
            res.json(response);
        }).catch(function (error) {
            res.json({ success: false });
        })
    });

    app.post("/api/getnearbyusers", function (req, res) {
        models.Movies.findAll({
            include: [models.User],
            where: {
                movieId: req.body.movieId
            }
        }).then(function (response) {
            if (response.length > 1) {
                var origin = "&origins=";
                var destinations = [];
                response.forEach(function (elem) {
                    if (elem.User.id === req.body.userId) {
                        origin += elem.User.location;
                        destinations.push(""); //this empty string is to ensure that destinations.length === response.length and that destinations and userids line up
                    } else {
                        destinations.push("&destinations=" + elem.User.location);
                    }
                });
                var queryURL = "https://maps.googleapis.com/maps/api/distancematrix/json?key=" + process.env.GOOGLEMAPSAPIKEY + origin
                var results = [];
                var i = 0;
                function recursiveGoogleCall() {
                    if (i < response.length) {
                        if (destinations[i] !== "") {
                            axios
                                .get(queryURL + destinations[i])
                                .then(function (googleRecursiveResponse) {
                                    if (googleRecursiveResponse.data.rows[0].elements[0].distance.value < req.body.distance) {
                                        var newData = {
                                            userId: response[i].User.id,
                                            profilePic: response[i].User.profilePic,
                                            email: response[i].User.email
                                        };
                                        results.push(newData);
                                    }
                                    i++;
                                    recursiveGoogleCall();
                                })
                                .catch(function (error) {
                                    console.error(error);
                                })
                        } else {
                            i++;
                            recursiveGoogleCall();
                        }
                    } else {
                        res.json(results);
                    }
                }
                recursiveGoogleCall();
                //and i would just like to take this moment to say.... recursion is a BITCH!!!
            } else {
                res.json({ success: false })
            }
        }).catch(function (error) {
            console.error(error);
        })
    })
}