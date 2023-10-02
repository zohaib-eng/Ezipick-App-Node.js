const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define(
    "parents",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
        clientId: { type: DataTypes.BIGINT },
      name: {
        type: DataTypes.TEXT,
      },
      email: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
        motherEmail: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
        userName: {
        type: DataTypes.TEXT,
      },
      phoneNo: {
        type: DataTypes.TEXT,
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      role: {type: DataTypes.TEXT,},
      roleAr: {type: DataTypes.TEXT,},
      qrCode: {type: DataTypes.TEXT,},
      lang: {type: DataTypes.TEXT,},
      nationalId: {type: DataTypes.TEXT,},
      deviceToken: { type: DataTypes.TEXT },
      deviceType: { type: DataTypes.TEXT },
      credentialSentAt: {type: DataTypes.TEXT},
    },
    {
      initialAutoIncrement: 1000000,
    }
  );
};
