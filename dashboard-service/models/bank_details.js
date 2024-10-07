"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BankDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BankDetails.init(
    {
      merchantId: { type: DataTypes.STRING, allowNull: false, unique: true },
      bankName: { type: DataTypes.STRING, allowNull: false },
      accountNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
      accHolderName: { type: DataTypes.STRING, allowNull: false, unique: true },
      ifsc: { type: DataTypes.STRING, allowNull: false },
      accountType: {
        type: DataTypes.ENUM("savings", "current"),
        allowNull: false,
        defaultValue: "savings",
      },
    },
    {
      sequelize,
      modelName: "BankDetails",
      tableName: "bank_details"
    }
  );
  return BankDetails;
};
