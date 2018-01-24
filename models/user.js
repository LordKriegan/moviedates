module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
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
      profilePic: {
          type: DataTypes.STRING,
          defaultValue: "/assets/images/defaultUser.png"
      }
  }); 
  User.associate = function(models) {
    models.User.hasMany(models.Movies, {
        onDelete: "cascade"
    });
    models.User.hasMany(models.UserChats, {
        onDelete: "cascade"
    });
  };
  return User; 
};