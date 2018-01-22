module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
      },
      hash: {
          type: DataTypes.STRING(1500),
          allowNull: false
      },
      salt: {
          type: DataTypes.STRING,
          allowNull: false
      },
      age: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "N/A",
          validate: {
              len: [0, 3],
          }
      },
      description: {
          type: DataTypes.STRING,
          defaultValue: "N/A", 
          validate: {
              len: [0, 300]
          }
      },
      gender: {
          type: DataTypes.STRING,
          defaultValue: "N/A",
      },
      location: {
          type: DataTypes.STRING,
          allowNull: false, 
      },
      movieList: {
          type: DataTypes.STRING
      },
      profilePic: {
          type: DataTypes.STRING
      }
  }); 
  User.associate = function(models) {
    models.User.hasMany(models.Movies, {
        onDelete: "cascade"
    });
  };
  return User; 
};