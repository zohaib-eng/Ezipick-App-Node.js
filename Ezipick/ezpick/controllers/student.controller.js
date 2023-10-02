// Package Imports
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const bodyParser = require('body-parser')
const { sendEmail } = require("../utils/sendEmail");
// Local Imports
const { StudentService, ParentService } = require("../services");
module.exports = class {
  // Get All
  static async getAll(_, res) {
    const data = await StudentService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, students: data.result });
    }
  }
  // Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByColumn("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, students: [] });
      } else {
        res.status(200).json({ success: true, students: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By Id
  static async getByGrade(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByColumn("gradeId", id);
      if (data.error) {
        res.status(200).json({ success: true, students: [] });
      } else {
        res.status(200).json({ success: true, students: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  static async getByParent(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByColumn("parentId", id);
      if (data.error) {
        res.status(200).json({ success: true, students: [] });
      } else {
        res.status(200).json({ success: true, students: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, student: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }
  // Get studentId
  static async getTeacherId(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getId(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, result: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // addSibling
  static async addSibling(req, res) {
    // first search the parent based on the email and phone no
    const { email, phoneNo, parentId: parentIdFromReq } = req.body;
    // const profileUrl = req.file.location;
    console.log(email);

    let parentId = undefined;

    if (!parentIdFromReq) {
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Please provide parent email.",
        });
        return;
      }

      const existingParentCheck = await ParentService.getByColumn(
        "email",
          email
      );

      if (!existingParentCheck.error) {
        parentId = existingParentCheck.result[0].id;
      } else {
        const newParent = {
          email: email,
        };

        if (phoneNo) newParent.phoneNo = phoneNo;

        const parentAddition = await ParentService.create(newParent);
        if (parentAddition.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
          return;
        }
        parentId = parentAddition.result.id;
      }
    } else {
      parentId = parentIdFromReq;
    }

    const data = await StudentService.create({ ...req.body, parentId });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const { result } = await StudentService.getById(data.result.id);
      res.status(200).json({ success: true, student: result });
    }
  }
  // Create
  static async create(req, res) {
    // first search the parent based on the email and phone no
    // const profileUrl = req.file.location;
    // console.log(profileUrl)
    const { email, phoneNo,motherEmail,clientId, parentId: parentIdFromReq } = req.body;

    let parentId = undefined;

    if (!parentIdFromReq) {
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Please provide parent email.",
        });
        return;
      }

      const existingParentCheck = await ParentService.checkEmail(clientId,email);

      if (!existingParentCheck.error) {
        parentId = existingParentCheck.result[0].id;
        res.status(200).json({ success: false, student: existingParentCheck });
        return;
      } else {
        const newParent = {
          clientId: clientId,
          email: email,
          motherEmail:motherEmail
        };

        if (phoneNo) newParent.phoneNo = phoneNo;

        const parentAddition = await ParentService.create(newParent);
        if (parentAddition.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
          return;
        }
        parentId = parentAddition.result.id;
      }
    } else {
      parentId = parentIdFromReq;
    }

    // const data = await StudentService.create({ ...req.body, parentId,profileUrl });
    const data = await StudentService.create({ ...req.body, parentId });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const { result } = await StudentService.getById(data.result.id);
      res.status(200).json({ success: true, student: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, email,parentId,phoneNo,password,name,gradeId,motherEmail,gender,schoolId,nameAr,isSibling,clientId} = req.body;
    console.log(req.body)
    let setParentId = undefined;
    if (email) {
      const existingParentCheck = await ParentService.checkEmail(clientId,email);
      if(!existingParentCheck.error){
        setParentId = existingParentCheck?.result[0].id;
      }
      if (!existingParentCheck.error && !isSibling){
        if (existingParentCheck.result[0].id != parentId) {
          res.status(500).json({
            success: true,
            message: "This email is already exits.",
          });
          return;
        }
      }
    }
    if (id &&  parentId ) {
      if (isSibling) {
        const data = await StudentService.update(id, {
          nameAr: nameAr,
          name: name,
          schoolId:schoolId,
          gradeId:gradeId,
          gender:gender,
          parentId:setParentId
        });
        const parentdata = await ParentService.update(setParentId, {
          password: password,
          phoneNo: phoneNo,
          email:email,
          motherEmail:motherEmail
        });
        if (data.error && parentData.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
        } else {
          res.status(200).json({ success: true });
        }
      }else {
        const data = await StudentService.update(id, {
          nameAr: nameAr,
          name: name,
          schoolId:schoolId,
          gradeId:gradeId,
          gender:gender
        });
        const parentData = await ParentService.update(parentId, {
          password: password,
          phoneNo: phoneNo,
          email:email,
          motherEmail:motherEmail
        });
        if (data.error && parentData.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
        } else {
          res.status(200).json({ success: true });
        }
      }

    }
    else
    {
      res
          .status(400)
          .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Update
  static async updateProfile(req, res) {
    const profileUrl = req.file.location;
    const { id } = req.body;
    if (id) {
      const data = await StudentService.update(id, {
        profileUrl: profileUrl,
      });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Profile image Uploaded.", url:profileUrl  });
      }
    } else {
      console.log("Not Found");
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }
  }
  // Import
  static async import(req, res) {
    let count = null;
    let data = null;
    for (let i = 0; i < req.body.students.length; i++) {

      let parentId = undefined;
      let student = undefined;
      const existingParentCheck = await ParentService.getByColumn(
          "email",
          req.body.students[i].parentEmail
      );
      if (!existingParentCheck.error) {
        parentId = existingParentCheck.result[0].id;
      } else {
        const newParent = {
          email: req.body.students[i].parentEmail,
        };

        if (req.body.students[i].parentPhone) newParent.phoneNo = req.body.students[i].parentPhone;

        const parentAddition = await ParentService.create(newParent);
        if (parentAddition.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
          return;
        }
        parentId = parentAddition.result.id;
      }
       student = ({
        profileUrl: req.body.students[i].profileUrl,
        name: req.body.students[i].name,
        nameAr: req.body.students[i].nameAr,
        gender: req.body.students[i].gender,
        parentId: parentId,
        studentId: req.body.students[i].studentId,
        schoolId: req.body.students[i].schoolId,
        gradeId: req.body.students[i].gradeId,
        clientId: req.body.students[i].clientId,
      });
        const data = await StudentService.create(student);
        if (!data.error) {
          count++
        }
      }
    res.json({success: true, message: count+' students import successfully'});
  }

  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.delete(id);
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID" });
    }
  }
  // Send email single
  static async sendEmail(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByIdComplete(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        const emailFather = await sendEmail(data.result.parent.email, 'ezpick credentials',data.result.name,data.result.parent.id,data.result.parent.password);
        const emailMother = await sendEmail(data.result.parent.motherEmail, 'ezpick credentials',data.result.name,data.result.parent.id,data.result.parent.password);
        var dateTime = new Date();
        const parentdata = await ParentService.update(data.result.parent.id, {
          credentialSentAt:dateTime.toString()
        });
        res.status(200).json({ success: true, message: "Email Sent" });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Send email Bulk
  static async bulkSendEmail(req, res) {
    let count=0;
    const gradeIds  = req.body;
    if (gradeIds){
      for (let i in gradeIds) {
        const gradeId = gradeIds[i];
        if (gradeId) {
          const data = await StudentService.getByColumn("gradeId", gradeId);
          const student= data.result;
          if (data.error) {
            res.status(200).json({success: false, message: "Not found."});
          } else {
            let j = 0; const iMax = student.length;
            for(j ; j < iMax; j++) {
              if(student[j].parent.email){
                const emailFather = await sendEmail(student[j].parent.email, 'ezpick credentials',student[j].name,student[j].parent.id,student[j].parent.password);
                const emailMother = await sendEmail(student[j].parent.motherEmail, 'ezpick credentials',student[j].name,student[j].parent.id,student[j].parent.password);
                var dateTime = new Date();
                const parentdata = await ParentService.update(student[j].parent.id, {
                  credentialSentAt:dateTime.toString()
                });
              }
            }
            count++
          }
        }
      }
      res.status(200).json({success: true, message: "Successfully Sent"});
    } else {
      res.status(400).json({ success: false, message: "Please provide an IDs." });
    }
  }
  // promoteStudent
  static async promoteStudent(req, res) {
    const { gradeId } = req.params;
    const { schoolId } = req.query;
    const { promotedSchoolId } = req.query;
    const { promotedGradeId } = req.query;
    let { students }  = req.query;
     students = JSON.parse(students);
    if (students.length > 0) {
      students.map(async (item)=> {
        const data = await StudentService.update(item, {
          schoolId:promotedSchoolId,
          gradeId:promotedGradeId
        });
        // console.log(item)
      });
      res.status(200).json({ success: true });
    }else {
      res.status(200).json({ success: false });
    }
  }

};
