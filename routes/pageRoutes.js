module.exports = function(app) {
    app.get("/searchmovies", function(req, res) {
        res.render("moviesearch");
    });
    app.get("/messages", function(req, res) {
        res.render("messages");
    })
}