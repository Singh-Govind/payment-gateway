"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MerchantDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MerchantDetails.init(
    {
      userId: { type: DataTypes.STRING, allowNull: false, unique: true },
      MerchantId: { type: DataTypes.STRING, allowNull: false, unique: true },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      kyc: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: "MerchantDetails",
      tableName: "merchant_details",
    }
  );
  return MerchantDetails;
};
