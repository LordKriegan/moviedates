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

window.onload = function () {
    loginToken = window.localStorage.getItem("loginToken")
    if (!loginToken) {
        window.location.href = "/login";
    } else {
        axios({
            method: "POST",
            url: "/api/getchatlist",
            headers: { "Authorization": "Bearer " + loginToken },
            data: { userId: JSON.parse(window.atob(loginToken.split('.')[1])).id }
        }).then(function (response) {
            response.data.forEach(function(elem) {
                var newDiv = $("<div class='chatListItem' data-chatRef='" + elem.chatID + "'>");
                $(newDiv).append("<img class='chatListPic' src='" + elem.profilePic + "' />");
                $(newDiv).append("<span class='chatListName'>" + elem.reciever +"</span>");
                $("#chatList").append(newDiv);
            });
        }).catch(function (error) {
            console.error(error)
        })
    }

    $(document).on("click", ".chatListItem", function() {
        console.log("initiating chat in room " + $(this).attr("data-chatRef"));
    })
};