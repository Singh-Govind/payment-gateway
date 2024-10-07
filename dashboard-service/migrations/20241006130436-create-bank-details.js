'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('bank_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: { type: DataTypes.STRING, allowNull: false, unique: true },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('bank_details');
  }
};