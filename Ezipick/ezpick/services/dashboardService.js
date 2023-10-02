// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
const { formatDateWithOutTime } = require("../utils/format");

module.exports = class {
  // dashboard Api

  static dashboard = async (columnName, columnValue, dateFrom, dateTo) =>
    await catchError(async () => {
      //total-Schools
      const result = await db.Schools.count({
        where: { [columnName]: columnValue },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      //total Grades
      const result1 = await db.Grades.count({
        where: { [columnName]: columnValue },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      // total-Teachers
      const result2 = await db.Teachers.count({
        where: { [columnName]: columnValue },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      // total-Students
      const result3 = await db.Students.count({
        where: { [columnName]: columnValue },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      // total parents count
      const result4 = await db.Parents.count({
        where: { [columnName]: columnValue },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      //total android devices
      const result5 = await db.Parents.count({
        where: { [columnName]: columnValue, deviceType: "android" },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      //total iphone devices
      const result6 = await db.Parents.count({
        where: { [columnName]: columnValue, deviceType: "iphone" },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      //total null devices
      const result7 = await db.Parents.count({
        where: { [columnName]: columnValue, deviceType: null },
        createdAt: { [Op.between]: [dateFrom, dateTo] },
      });

      // total Requests

      const result8 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
      });

      //total sentRequests
      const result9 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          status: 0,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });
      // // total approveRequests
      const result10 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          status: 1,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });

      // total confirmRequests
      const result11 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          status: 2,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });

      // request perDay

      var currentDate = new Date();
      var _day = currentDate.getDate();
      var _month = currentDate.getMonth() + 1; // Months are zero-based
      var _year = currentDate.getFullYear();

      // Format the date as desired (e.g., DD/MM/YYYY)
      var _formattedDate = _year + "-" + _month + "-" + _day;
      // Calculate the date of the 7th day before the current date
      var pastDate = new Date();
      pastDate.setDate(currentDate.getDate() - 7);

      // Extract the day, month, and year from the past date
      var day = pastDate.getDate();
      var month = pastDate.getMonth() + 1; // Months are zero-based
      var year = pastDate.getFullYear();

      // Format the date as desired (e.g., DD/MM/YYYY)
      var formattedDate = year + "-" + month + "-" + day;
      const result12 = await db.Requests.findAll({
        where: {
          [columnName]: columnValue,
          requestTime: {
            [Op.between]: [
              formatDateWithOutTime(dateFrom),
              formatDateWithOutTime(dateTo),
            ],
          },
        },
        // order: [["createdAt", "DESC"]],
      });

      function getDayName(date) {
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        return days[date.getDay()];
      }

      // Filter and count the objects created on each day
      let per_day = result12?.reduce(function (acc, obj) {
        var day = getDayName(new Date(obj.requestTime));
        // Check if the day exists in the accumulator object, otherwise initialize it with 0
        if (!acc[day]) {
          acc[day] = 0;
        }

        // Increment the count for the respective day
        acc[day]++;

        return acc;
      }, {});

      // if (result)
      return {
        result,
        result1,
        result2,
        result3,
        result4,
        result5,
        result6,
        result7,
        result8,
        result9,
        result10,
        result11,
        result12,
        per_day,
      };
      // else throw new Error();
    });
};
