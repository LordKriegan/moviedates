var models = require("../models");
var crypto = require('crypto');
var jwt = require("jsonwebtoken");

function getHash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}
function getSalt() {
    return crypto.randomBytes(16).toString("hex");
}
function generateJWT(user) {
    var expire = new Date();
    expire.setDate(expire.getDate()+7);
    return jwt.sign({
        id: user.id,
        email: user.email,
        location: user.location,
        exp: expire.getTime()/1000
    }, process.env.JWT_SECRET);
}

module.exports = function(app) {
    app.get("/login", function(req, res) {
        res.render("login");
    });

    app.post("/api/auth/signup", function(req, res) {
        var salt = getSalt();
        models.User.create({
            email: req.body.email,
            hash: getHash(req.body.password, salt),
            salt: salt,
            age: req.body.age,
            description: req.body.desc,
            gender: req.body.gender,
            location: req.body.location,
            profilePic: req.body.picture
        });
    });

    app.post("/api/auth/login", function(req, res) {
        models.User.findOne({
            where: {
                email: req.body.email
            }
        }).then(function(resp) {
            if (resp) {
                var inputHash = getHash(req.body.password, resp.salt);
                if(inputHash === resp.hash) {
                    res.json({token: generateJWT(resp)});
                } else {
                    res.status(400).end("Wrong Password!");
                }
            } else {
                res.status(404).end("User not found");
            }
        })
    })
}