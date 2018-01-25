module.exports = function(app) {
    app.get("/", function(req, res) {
        res.redirect("/login");
    });
    app.get("/searchmovies", function(req, res) {
        res.render("moviesearch");
    });
    app.get("/accountsetting", function(req, res) {
        res.render("accountsetting");
    });
    app.get("/messages", function(req, res) {
        res.render("messages");
    });
    app.get("/404", function(req, res) {
        res.status(404).render("err404", { layout: 'err404.handlebars' });
    });
    
    //catch all route
    app.get("*", function(req, res) {
        res.redirect("/404");
    });
}