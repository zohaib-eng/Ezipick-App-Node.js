const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("csvfile", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    published: {
      type: DataTypes.STRING
    },
  });
};
