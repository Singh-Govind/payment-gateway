"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });
    }
  }
  RefreshToken.init(
    {
      userId: { type: DataTypes.STRING, allowNull: false, unique: true },
      refreshToken: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "refresh_tokens",
    }
  );
  return RefreshToken;
};
