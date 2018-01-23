module.exports = function (sequelize, DataTypes) {
    var Movies = sequelize.define("Movies", {
        movieId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        moviePoster: {
            type: DataTypes.STRING,
            defaultValue: "/assets/images/nomoviepic.png"
        },
        movieTitle: {
            type: DataTypes.STRING
        }
    });
    Movies.associate = function (models) {
        models.Movies.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Movies;
};