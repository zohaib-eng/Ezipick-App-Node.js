// Package Imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const readline = require('readline');
const fs = require('fs');
// Local Imports
const { hash } = require("../utils/bcrypt");
// Local Imports
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const { TeacherService, TeacherGradeService ,ClientService} = require("../services");
const  nodemailer = require("nodemailer");
const { sendEmail } = require("../utils/sendEmail");

module.exports = class {

  // Update Password
  static async updatePassword(req, res) {
    const { id, newPassword, oldPassword } = req.body;

    const user = await TeacherService.getById(id);
    if (user.error) {
      res.status(200).json({ success: false ,message:'User not found'});
      return;
    }
    if (!newPassword && newPassword.length==0) {
      res.status(200).json({ success: false ,message:' New password filed is missing'});
      return;
    }
    if (!oldPassword && oldPassword.length==0) {
      res.status(200).json({ success: false ,message:'Old password filed is missing'});
      return;
    }
    // validate old password
    const passwordCheck = await TeacherService.getByColumnForLogin("password", oldPassword);
    if (passwordCheck.error) {
      res.status(200).json({
        success: false,
        message: "invalid credentials",
      });
      return;
    }

    const data = await TeacherService.update(id, {
      password: newPassword,
    });
    console.log(data)
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true , message: "Password Updated successful." });
    }
  }
  // Update
  static async updateProfile(req, res) {
    const profileUrl = req.file.location;
    const { id } = req.body;
    if (id) {
      const data = await TeacherService.update(id, {
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
            .json({ success: true, message: "Profile image Uploaded.", url:profileUrl });
      }
    } else {
      console.log("Not Found");
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }
  }
  //login by email
  static async loginByEmail(req, res) {
    const { email,password } = req.body;

    // Validate Email
    if (!email || email.trim() === "") {
      res
          .status(400)
          .json({ success: false, message: "Please provide an email." });
      return;
    }



    // Fetch user with the email
    const userCheck = await TeacherService.getByColumn({ email: email });
    if (userCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this User yet...",
      });
      return;
    }
    // Compare the passwords
    // const passwordCheck = await TeacherService.getByColumnForLogin("password", password);
    // if (passwordCheck.error) {
    //   res.status(200).json({
    //     success: false,
    //     message: "invalid credentials",
    //   });
    //   return;
    // }
    const [result] = userCheck.result;

    // Data to send as API response
    const response = {
      id: result.id,
      role: "TEACHER",
      email: result.email,
      name: result.name,
    };

    // Generate JWT Token
    const token = jwt.sign(response, JWT_SECRET);

    // Final Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
      role: "TEACHER",
      token,
    });
  }
  //login by email
  static async loginByEmailWebCallback(req, res) {
    const credentials = require('../credentials.json');
    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);
    const { code } = req.query;
    let email= '';
    if(code){
      try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('Access Token:', tokens.access_token);
        oauth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        // Example: Retrieve the user's Gmail profile
        const promise = () => new Promise((resolve, reject)=> {
          gmail.users.getProfile({ userId: 'me' }, (err, res) => {
            if (err) {
              console.error('The API returned an error:', err);
              reject()
              return;
            }
            const profile = res.data;
            console.log('Email Address:', profile.emailAddress);
            resolve(profile)
          });
        })
        const profile = await promise();
        if(profile.emailAddress){
          console.log('kjdgdjfgsd')
          const userCheck = await TeacherService.getByColumn({ email: profile.emailAddress });
          if (userCheck.error) {
            res.status(200).json({
              success: false,
              message: "Looks like you haven't registered this User yet...",
            });
            return;
          }
          const [result] = userCheck.result;
          // Data to send as API response
          const response = {
            id: result.id,
            role: "TEACHER",
            email: result.email,
            name: result.name,
          };
          // Generate JWT Token
          const token = jwt.sign(response, JWT_SECRET);
          // Final Response
          res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
            role: "TEACHER",
            token,
          });
        }
      } catch (error) {
        return res.status(401).json({ error: "User Not Found Or Not 553" });
      }
    }
  }
  //login by email
  static async verifyGoogleToken(req, res) {
    const { tokens }  = req.query;
    const { role }  = req.query;
    let userCheck='';
    let roleCheck='';
    try {
      // Verify the token is valid
      const  user  =   JSON.parse(Buffer.from(tokens.split('.')[1], 'base64').toString());
      const email =user.email
      if(email){
        if(role.includes("teacher")){
           userCheck = await TeacherService.getByColumn({ email: email });
          roleCheck='TEACHER';
        }
        if(role.includes("client")){
           userCheck = await ClientService.getByColumn("email", email);
          roleCheck='CLIENT';
        }
        console.log(roleCheck)
        if (userCheck.error) {
          res.status(200).json({
            success: false,
            message: "Looks like you haven't registered this User yet...",
          });
          return;
        }
        const [result] = userCheck.result;
        // Data to send as API response
        const response = {
          id: result.id,
          role: roleCheck,
          email: result.email,
          name: result.name,
        };
        // Generate JWT Token
        const token = jwt.sign(response, JWT_SECRET);
        // Final Response
        res.status(200).json({
          success: true,
          message: "Login successful",
          data: result,
          role: roleCheck,
          token,
        });
      }
    } catch (error) {
      return res.status(401).json({ error: "User Not Found Or Not Authorized" });
    }
  }
  static async loginByEmailWeb(req, res) {
    const credentials = require('../credentials.json');
    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly']
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    res.redirect(authUrl);

  }
  // verifyToken
  static async verifyToken(req, res) {
    const { token }  = req.body;
    try {
      // Verify the token is valid
      const  user  = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "Authorized",
        data: user,
      });
    } catch (error) {
      return res.status(401).json({ error: "User Not Found Or Not Authorized" });
    }
  }
  // forgot pasword
  static async forgotPassword(req, res) {
    const { userName,email } = req.body;
    let data;
    if (userName || email) {
      if (email){
        data = await TeacherService.getByColumn({email:email});
      }
      else if (userName){
        data = await TeacherService.getByColumn({userName:userName});
      }
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // check email
        const teacher = data.result[0];
        if(teacher.email){
          // Data to send as API teacher
          const currentDate = new Date()
          const expiry = currentDate.setTime(currentDate.getTime() + (2*60*60*1000));
          const TOKEN_DATA = {
            id: teacher.id,
            role: 'TEACHER',
            expiry
          };
          // Generate JWT Token
          const token = jwt.sign(TOKEN_DATA, JWT_SECRET);

          //send email

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'waqar@whetstonez.com', // generated ethereal user
              pass: 'V5LA3D92KhOfjMB1', // generated ethereal password
            },
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"EZPick 👻" < info@ezpick.co>', // sender address
            to: teacher.email, // list of receivers
            subject: "Forgot Password ✔", // Subject line
            html: `<!DOCTYPE html>
            <html>
  <head>
    <meta charset="utf-8">
    <title>Forgot Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 10px;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 style="text-align:center ">Forgot Password</h1>
      <p>Hello,</p>
      <p>You have requested to reset your password for our website. Please click the link below to reset your password:</p>
      <p><a href="https://www.google.com/${token}">Reset</a></p>
      <p>If you did not request to reset your password, please ignore this email.</p>
      <div class="footer" style="text-align:left ">
        <p>Thank you,</p>
        <p>EZPick Team</p>
      </div>
    </div>
  </body>
</html>`, // html body
          });

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...



          // Final teacher
          res.status(200).json({
            success: true,
            message: "Email Sent successful",
          });
        }else {
          res
              .status(200)
              .json({ success: false, message: "Email Not Found." });
        }

      }
    } else {
      res
          .status(200)
          .json({ success: false, message: "teacher Not found" });
    }
  }


  // Login
  static async login(req, res) {
    const { username, email, password } = req.body;

    // Validate Email
    // if (!email || email.trim() === "") {
    //   res
    //       .status(400)
    //       .json({ success: false, message: "Please provide an email." });
    //   return;
    // }
// Validate username
    if (!username || username.trim() === "") {
      res
          .status(400)
          .json({ success: false, message: "Please provide an username." });
      return;
    }

    // Validate Password
    if (!password || password.trim() === "") {
      res
          .status(400)
          .json({ success: false, message: "Please provide an password." });
      return;
    }

    // Fetch user with the email
    const userCheck = await TeacherService.getByColumn({username});
    if (userCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this username yet...",
      });
      return;
    }

    const [result] = userCheck.result;

    // Compare the passwords
    const passwordCheck = await TeacherService.getByColumnForLogin("password", password);
    if (passwordCheck.error) {
      res.status(200).json({
        success: false,
        message: "invalid credentials",
      });
      return;
    }

    // Data to send as API response
    const response = {
      id: result.id,
      role: "TEACHER",
      email: result.email,
      name: result.name,
    };

    // Generate JWT Token
    const token = jwt.sign(response, JWT_SECRET);

    // Final Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
      role: "TEACHER",
      token,
    });
  }

  // Get All
  static async getAll(_, res) {
    const data = await TeacherService.getAll();
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, teachers: data.result });
    }
  }
// Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByclient({ clientId: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, teachers: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By Id
  static async getByClientWeb(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByClientWeb({ clientId: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, teachers: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By teacher id
  static async getStudent(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByGrade({ id: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, grades: data.students });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide school ID." });
    }
  }
  static async getBySchoolId(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByColumn({ schoolId: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, teachers: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide school ID." });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, teacher: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Get By Id
  static async getByIdWeb(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByIdWeb(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, teacher: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Send email single
  static async sendEmail(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        const email = await sendEmail(data.result.email,'ezpick credentials',data.result.name,data.result.userName,data.result.password);
        res.status(200).json({ success: true, message: "Email Sent" });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Send email Bulk
  static async bulkSendEmail(req, res) {
    let count = 0;
    const { teacherIds } = req.body;
    if (teacherIds){
      for (let i in teacherIds) {
        const teacherId = teacherIds[i];
        if (teacherId) {
          const data = await TeacherService.getById(teacherId);
          if (!data.error) {
            //   res.status(200).json({success: false, message: "Not found."});
            // } else {
            const email = await sendEmail(data.result.email, 'ezpick credentials',data.result.name,data.result.userName,data.result.password);
            count++
          }
        }
      }
      res.status(200).json({success: true, message: "Total Credentials "+ count+" Sent"});
    } else {
      res.status(400).json({ success: false, message: "Please provide an IDs." });
    }
  }

  // Create
  static async create(req, res) {
    const profileUrl = req.file.location;
    const { email, password, ...rest } = req.body;
    if (!email) {
      res
          .status(200)
          .json({ success: false, message: "Please provide an email." });
      return;
    }
    const existingUserCheck = await TeacherService.getByColumn({ email });
    if (!existingUserCheck.error) {
      res.status(200).json({ success: false, message: "Email Already Registered." })
      return;
    }
    // const hashedPassword = await hash(password);
    const data = await TeacherService.create({ password: password,
      email,
      profileUrl,
      ...rest,
    });
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {

      const teacherId = data.result.id;
      //
      // for (let i in req.body.grades) {
      //   const gradeId = req.body.grades[i];
      //   await TeacherGradeService.create({ teacherId, gradeId });
      // }

      const { result } = await TeacherService.getById(teacherId);

      res.status(200).json({ success: true, teacher: result });
    }
  }
  // Create
  static async simpleCreate(req, res) {
    const { email, password,clientId, ...rest } = req.body;
    if (!email) {
      res
          .status(200)
          .json({ success: false, message: "Please provide an email." });
      return;
    }
    const existingUserCheck = await TeacherService.getByColumn({ email,clientId });
    if (!existingUserCheck.error) {
      res.status(200).json({ success: false, message: "Email Already Registered." })
      return;
    }
    // const hashedPassword = await hash(password);
    const data = await TeacherService.create({ password: password,
      email,
      clientId,
      ...rest,
    });
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {

      const teacherId = data.result.id;

      for (let i in req.body.grades) {
        const gradeId = req.body.grades[i];
        await TeacherGradeService.create({ teacherId, gradeId });
      }

      const { result } = await TeacherService.getById(teacherId);

      res.status(200).json({ success: true, teacher: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await TeacherService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        if(req.body.grades){
          const teachersGrades = await TeacherGradeService.delete(id);
          for (let i in req.body.grades) {
            const gradeId = req.body.grades[i];
            let teacherId =id
            await TeacherGradeService.create({ teacherId, gradeId });
          }
        }

        res.status(200).json({ success: true });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }

  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.delete(id);
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
  // aliass token
  static async aliasToken(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // Data to send as API response
        const response = {
          id: data.result.clientId,
        };
        // Generate JWT Token
        const aliasToken = jwt.sign(response, JWT_SECRET);
        res.status(200).json({ success: true ,aliasToken:aliasToken});
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }

  }
};
