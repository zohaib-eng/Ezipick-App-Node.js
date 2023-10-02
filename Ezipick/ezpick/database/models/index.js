const getSchoolModel = require("./school.model");
const getAdminModel = require("./admin.model");
const getClientModel = require("./client.model");
const getCampusModel = require("./campus.model");
const getGradeModel = require("./grade.model");
const getTeacherModel = require("./teacher.model");
const getTeacherGradeModel = require("./teacherGrade.model");
const getStudentModel = require("./student.model");
const getParentModel = require("./parent.model");
const getRequestModel = require("./request.model");
const getNotificationModel = require("./notification.model");
const getPushNotificationModel = require("./pushNotification.model");
const getGradesTimeModel = require("./gradesTime.model");
const getPickUpGuardianModel = require("./pickUpGuardian.model");
const getPickUpGuardianStudentModel = require("./pickUpGuardianStudent.model");
const getCsvFile = require('./csvFile.model')

module.exports = {
  getSchoolModel,
  getAdminModel,
  getClientModel,
  getCampusModel,
  getGradeModel,
  getTeacherModel,
  getTeacherGradeModel,
  getStudentModel,
  getParentModel,
  getRequestModel,
  getNotificationModel,
  getPushNotificationModel,
  getGradesTimeModel,
  getPickUpGuardianModel,
  getPickUpGuardianStudentModel,
  getCsvFile
};
