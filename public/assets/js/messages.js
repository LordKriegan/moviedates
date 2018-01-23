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
var currentChat;
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
        /*    background-color: #888888;
    color: #060606; */
        $("#chatList > .chatListItem").css("background-color", "#060606");
        $("#chatList > .chatListItem").css("color", "#888888");
        $(this).css("background-color", "#888888");
        $(this).css("color", "#060606")
        console.log("initiating chat in room " + $(this).attr("data-chatRef"));
        if (currentChat) {
            fbdb.ref("chatrooms/" + currentChat).off();
        }
        $("#chatRoomBox").empty();
        currentChat = $(this).attr("data-chatRef");
        fbdb.ref("chatrooms/" + currentChat).on("value", function(snapshot) {
            $("#chatRoomBox").empty();
            snapshot.forEach(function(childSnapShot) {
                var key = childSnapShot.val();
                var newDiv = $("<div>");
                if (key.name === JSON.parse(window.atob(loginToken.split('.')[1])).email.split("@")[0]) {
                    $(newDiv).addClass("myChats");
                } else {
                    $(newDiv).addClass("theirChats");
                }
                $(newDiv).append("<img class='chatListPic' src='" + key.profilePic + "' />");
                $(newDiv).append("<span>" + key.msg + "</span>");
                $("#chatRoomBox").append(newDiv);
            })
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    });

    $("#textBarBtn").on("click", function(e) {
        e.preventDefault();
        if (currentChat) {
            fbdb.ref("chatrooms/" + currentChat).push({
                name: JSON.parse(window.atob(loginToken.split('.')[1])).email.split("@")[0],
                msg: $("#textBar").val().trim(),
                profilePic: JSON.parse(window.atob(loginToken.split('.')[1])).profilePic
            })
        }
    }) 
};