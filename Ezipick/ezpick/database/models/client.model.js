const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define(
    "clients",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.TEXT },
      email: { type: DataTypes.TEXT },
      password: { type: DataTypes.TEXT },
      status: { type: DataTypes.BOOLEAN, defaultValue: true },
      schoolName: { type: DataTypes.TEXT },
      mobile: { type: DataTypes.TEXT },
      landline: { type: DataTypes.TEXT },
      perUserPrice: { type: DataTypes.TEXT },
      startDate: { type: DataTypes.TEXT },
      duration: { type: DataTypes.TEXT },
      expiryDate: { type: DataTypes.TEXT },
      country: { type: DataTypes.TEXT },
      city: { type: DataTypes.TEXT },
    },
    {
      initialAutoIncrement: 1000000,
    }
  );
};
