// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
const fs = require('fs')
const path = require('path');
const fastCSV = require('@fast-csv/parse');
const readXlsxFile = require("read-excel-file/node");
const { File } = require("buffer");
const { file } = require("googleapis/build/src/apis/file");
const { error } = require("console");
const { json } = require("body-parser");
const { getCsvFile } = require("../database/models");

module.exports = class {
    static upload = async (fileName) => {
    // const uploadFile = req.file;
    // console.log(uploadFile);
    // if (!file) {
    //   return console.log('No files were uploaded.');
    // }
    
    
    const fileUploadPath = __dirname + '/../'+ fileName;
    
    const uploadedFileReadStream = fs.createReadStream(fileUploadPath);
    const csvRows = [];
    // const uniqueRows = new Set();
    const duplicateTracker = {};
    uploadedFileReadStream
    .pipe(fastCSV.parse({ headers: true, ignoreEmpty: true, strictColumnHandling: true, objectMode:false, trim: true, rtrim:true, ltrim:true, discardUnmappedColumns:true}))
    .on('error', error => console.error(error))
    .setEncoding('utf-8')
    .on('data', (row) => {
        // Apply filter on rows
        const dataa = row.split(',')
  const filteredRows = dataa.filter((data) => {
    // Filter condition: Include rows where the "age" column is greater than or equal to 18
    // const columns = row.split(',');
    const title = parseInt(dataa[0]); // Assuming age is the second column (index 1)
    console.log("---->>>",dataa[0]);
    return title===title;
  });console.log("---->>>",filteredRows);
      // const uniqueCriterion = row; // Change "id" to the appropriate column name

    // Check if the row is unique based on the criterion
    // if (!duplicateTracker[uniqueCriterion]) {
    //   // Mark this row as a duplicate in the tracker object
    //   duplicateTracker[uniqueCriterion] = true;

    //   // Store the unique row in the array
    //   csvRows.push(row);
    // }
  }
    // {
      // const rowString = JSON.stringify(row);
      // if (!uniqueRows.has(rowString)) {
        // uniqueRows.add(rowString);
      // }
    // }
    )
    // .on('end', () => {
    //   const uniqueRowss = Array.from(uniqueRows).map((rowString) =>
    //     JSON.parse(rowString)
    //   );
    //   csvRows.push(uniqueRowss)
    //   // Write unique rows to the output CSV file
    // })
    // .on("end", () => {console.log('xcxcxc==>>',db.getCsvFile);
    //   try{
    //     db.getCsvFile.create(csvRows)
    //     .then((result) => {
    //       // console.log('result: ', result);
    //       return result;
    //       // res.status(200).json({message:'save',csvRows})
    //     })
    //     .catch((error) => {
    //       throw error;
    //       // res.status(500).send({
    //       //   message: "Fail to import data into database!",
    //       // });
    //       //   error: error.message,
    //     });
    //   }catch(error){

    //   }
    // });
  }
}
// csvRows.push(JSON.parse(row))