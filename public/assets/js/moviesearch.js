window.onload = function () {
    loginToken = window.localStorage.getItem("loginToken")
    if (!loginToken) {
        window.location.href = "/login";
    } else {
        axios({
            method: "POST",
            url: "/api/getusermovies",
            headers: { "Authorization": "Bearer " + loginToken },
            data: { userId: JSON.parse(window.atob(loginToken.split('.')[1])).id }
        }).then(function(response) {
            response.data.forEach(function(elem) {
                var newMovie = $("<div class='text-center userMovie' data-movieId='" + elem.movieId + "'>");
                var newMoviePic = $("<img class='moviePosterPic' src='" + elem.moviePoster +"'/>");
                $(newMovie).append(newMoviePic);
                $(newMovie).append("<p class='moviePosterTitle'>" + elem.movieTitle + "</p>");
                $("#userMovieBox").append(newMovie);
            });
        }).catch(function(error) {
            console.error(error);
        });
    }

    $("#searchBtn").on("click", function () {
        var searchParams = $("#searchBar").val().trim();
        if (searchParams) {
            axios({
                method: "POST",
                url: "/api/searchmovies",
                headers: { "Authorization": "Bearer " + loginToken },
                data: { searchParam: $("#searchBar").val().trim() }
            }).then(function (response) {
                console.log(response);
                $("#movieSearchBox").empty();
                response.data.Search.forEach(function (elem) {
                    var newMovie = $("<div class='text-center moviePoster' data-movieId='" + elem.imdbID + "'>");
                    var newMoviePic = $("<img class='moviePosterPic'>");
                    if (elem.Poster === "N/A") {
                        $(newMoviePic).attr("src", "/assets/images/nomoviepic.png");
                    } else {
                        $(newMoviePic).attr("src", elem.Poster);
                    }
                    $(newMovie).append(newMoviePic);
                    $(newMovie).append("<p class='moviePosterTitle'>" + elem.Title + "</p>");
                    $("#movieSearchBox").append(newMovie);
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    });

    $(document).on("click", ".moviePoster", function() {
        var thisElem = this;
        var data = {
            userId: JSON.parse(window.atob(loginToken.split('.')[1])).id,
            movieId: $(thisElem).attr("data-movieId"),
            moviePoster: $($(thisElem).children()[0]).attr("src"),
            movieTitle: $($(thisElem).children()[1]).text()
        }
        console.log(data);
        axios({
            method: "POST",
            url: "/api/addusermovie",
            headers: { "Authorization": "Bearer " + loginToken },
            data: data
        }).then(function(response) {
            console.log(response);
            if (response.data.success) {
                var newUserMovie = $(thisElem).clone();
                $(newUserMovie).removeClass("moviePoster");
                $(newUserMovie).addClass("userMovie");
                $("#userMovieBox").append(newUserMovie);
            }
        }).catch(function(error) {
            console.error(error);
        });
    });

    $(document).on("click", ".userMovie", function() {
        var thisElem = this;
        axios({
            method: "POST",
            url: "/api/getnearbyusers",
            headers: { "Authorization": "Bearer " + loginToken },
            data: { 
                movieId: $(thisElem).attr("data-movieId"), 
                userId: JSON.parse(window.atob(loginToken.split('.')[1])).id,
                distance: ($("#distance").val() * 1609.34) //1609.34 = meters in a mile, google response has distance in meters
            }
        }).then(function(response) {
            console.log(response);
            $("#nearbyUsersBox").empty();
            response.data.forEach(function(elem) {
                console.log("test", elem);
                var nearbyUser = $("<div class='text-center nearbyUser' data-userId='" + elem.userId +"'>");
                $(nearbyUser).append("<img class='nearbyUserPic' src='" + elem.profilePic + "' />");
                $(nearbyUser).append("<p class='nearbyUserName'>" + elem.email.split("@")[0] + "</p>");
                $("#nearbyUsersBox").append(nearbyUser);
            });
        }).catch(function(error) {
            console.error(error);
        });
    });

    $(document).on("click", ".nearbyUser", function() {
        var thisElem = this;
        axios({
            method: "POST",
            url: "/api/startnewchat",
            headers: { "Authorization": "Bearer " + loginToken },
            data: {
                userOne: JSON.parse(window.atob(loginToken.split('.')[1])).id,
                userTwo: $(thisElem).attr("data-userId")
            }
        }).then(function(response) {
                //When a user clicks on another user, the messages actually show up
            window.location.href = '/messages'
            console.log(response);
        }).catch(function(error) {
            console.error(error);
        });
    });



    //Have the ability to press enter to enter for messages and movie searches




}