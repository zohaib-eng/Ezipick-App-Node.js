const SchoolService = require("./school.service");
const AdminService = require("./admin.service");
const ClientService = require("./client.service");
const CampusService = require("./campus.service");
const GradeService = require("./grade.service");
const TeacherService = require("./teacher.service");
const TeacherGradeService = require("./teacherGrade.service");
const StudentService = require("./student.service");
const ParentService = require("./parent.service");
const RequestService = require("./request.service");
const NotificationService = require("./notification.service");
const pushNotificationService = require("./pushNotification.service");
const GradeTimeService = require("./gradeTime.service");
const DashboardService = require("./dashboardService");
const csvFileService = require("./csvFile.service");

module.exports = {
  SchoolService,
  AdminService,
  ClientService,
  CampusService,
  GradeService,
  TeacherService,
  TeacherGradeService,
  StudentService,
  ParentService,
  RequestService,
  NotificationService,
  pushNotificationService,
  GradeTimeService,
  DashboardService,
  csvFileService
};
