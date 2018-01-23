module.exports = function (sequelize, DataTypes) {
    var UserChats = sequelize.define("UserChats", {
        chatID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reciever: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    UserChats.associate = function (models) {
        models.UserChats.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return UserChats;
};