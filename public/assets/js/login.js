window.onload = function () {
    if (window.localStorage.getItem("loginToken")) {
        window.location.href = "/searchmovies";
    }
    $("#showLogin").on("click", function (e) {
        e.preventDefault();
        $("#loginForm").css("display", "block");
        $("#signUpForm").css("display", "none");
    });

    $("#showSignup").on("click", function (e) {
        e.preventDefault();
        $("#loginForm").css("display", "none");
        $("#signUpForm").css("display", "block");
    });
    $("#signUpPicture").on("click", function (e) {
        e.preventDefault();
        openPicker()
    });
    $("#userLoginBtn").on("click", function (e) {
        e.preventDefault();
        axios
            .post("/api/auth/login", {
                email: $("#loginEmail").val().trim(),
                password: $("#loginPassword").val().trim()
            })
            .then(function (resp) {
                console.log(resp);
                window.localStorage.setItem("loginToken", resp.data.token);
                window.location.href = "/searchmovies";
            })
            .catch(function (err) {
                console.error(err);
            });
    });
    $("#userSignUpBtn").on("click", function (e) {
        e.preventDefault();
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = position.coords.latitude + "," + position.coords.longitude
                var newUser = {
                    email: $("#signUpEmail").val().trim(),
                    password: $("#signUpPw").val().trim(),
                    age: $("#signUpAge").val(),
                    desc: $("#signUpDesc").val().trim(),
                    gender: $("#signUpGender").val().trim(),
                    picture: fileUrl,
                    location: pos
                }
                axios
                    .post("/api/auth/signup", newUser)
                    .then(function (response) {
                        console.log(response);
                        axios
                        .post("/api/auth/login", {
                            email: newUser.email,
                            password: newUser.password
                        })
                        .then(function (resp) {
                            console.log(resp);
                            window.localStorage.setItem("loginToken", resp.data.token);
                            window.location.href = "/searchmovies";
                        })
                        .catch(function (err) {
                            console.error(err);
                        });
                    })
                    .catch(function (error) {
                        console.error(error);
                    })
            }, function (err) {
                console.error("Uh-oh! Something went wrong when we tried to get your location.", err);
            });
        } else {
            console.error("Your browser does not support geolocations.");
        }
    });
}