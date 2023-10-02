const multer = require("multer");

// const excelFilter = (req, file, cb) => {
//     if (
//       file.mimetype.split('/')[1] === 'csv'
//     ) {
//       cb(null, true);
//     } else {
//       cb("Please upload only excel file.", false);
//     }
//   };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./csvFiles");
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

var uploadFile = multer({ storage: storage });
module.exports = uploadFile;