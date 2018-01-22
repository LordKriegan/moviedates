module.exports = function(sequelize, DataTypes) {
    var Movies = sequelize.define("Movies", {
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false 
        }
    }); 
    Movies.associate = function(models) {
        models.Movies.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
     return Movies; 
  };