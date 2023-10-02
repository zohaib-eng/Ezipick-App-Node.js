// Package Imports

// Local Imports
const { csvFileService } = require("../services");
const express = require("express");

module.exports = class {

  static async csvFile(req, res) {
    const uploadFile = req.file;
    console.log(uploadFile);
    try {
      const data = await csvFileService.upload(uploadFile.path);
      console.log('data: ', data);
      res.status(200).json({ success: true, data: data })
    } catch(err){
      res.status(500)
        .json({ success: false, message: "Request could not be processed." })
      throw err;
    }
    
    // if(!data){
    //     return res
    //     .status(500)
    //     .json({ success: false, message: "Request could not be processed." });
    // }else {
    //     return res.status(200).json({ success: true, data: data.result });
    //   }
}
};
