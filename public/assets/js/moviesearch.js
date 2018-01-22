window.onload = function () {
    loginToken = window.localStorage.getItem("loginToken")
    if (loginToken) {
        var payload = JSON.parse(window.atob(loginToken.split('.')[1]));
        axios
        .post("/api/searchmovies", {
            lat: payload.location.split(",")[0],
            long: payload.location.split(",")[1]
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.error(error);
        })
    } else {
        window.location.href = "/login";
    }
    
}