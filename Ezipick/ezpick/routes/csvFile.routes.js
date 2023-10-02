const {  csvFileController } = require("../controllers");

const express = require("express");
const uploadFile = require("../middlewares/uploadFile");
const router = express.Router();



router.post("/upload/", uploadFile.single('file'),csvFileController.csvFile);


module.exports = router;
