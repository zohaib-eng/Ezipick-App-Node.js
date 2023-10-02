const moment = require("moment");

exports.formatDateWithOutTime = (value) => {
  moment.locale("en-US");
  return moment(value).format("YYYY-MM-DD");
};
