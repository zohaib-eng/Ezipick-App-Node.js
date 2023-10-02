// Package Imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Local Imports
const { hash } = require("../utils/bcrypt");
const nodemailer = require("nodemailer");


// Local Imports
const { GuardianService } = require("../services");
const JWT_SECRET = process.env.JWT_SECRET || "secret";
module.exports = class {
  // Update Password
  static async updatePassword(req, res) {
    const { id, newPassword, oldPassword } = req.body;

    const user = await GuardianService.getById(id);
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
    const passwordCheck = await GuardianService.getByColumnForLogin("password", oldPassword);
    if (passwordCheck.error) {
      res.status(200).json({
        success: false,
        message: "invalid credentials",
      });
      return;
    }
    // const hashedPassword = await hash(newPassword);

    const data = await GuardianService.update(id, {
      password: newPassword,
    });
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true ,message:'Password Update successful'});
    }
  }
  static async forgotPassword(req, res) {
    const { userName,email } = req.body;
    let data;
    if (userName || email) {
      if (email){
         data = await GuardianService.getByColumn("email", email);
      }
      else if (userName){
         data = await GuardianService.getByColumn("userName", userName);
      }
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // check email
        const parent = data.result[0];
        if(parent.email){
          // Data to send as API parent
          const currentDate = new Date()
          const expiry = currentDate.setTime(currentDate.getTime() + (2*60*60*1000));
          const TOKEN_DATA = {
            id: parent.id,
            role: 'PARENT',
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
            to: parent.email, // list of receivers
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



          // Final parent
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
          .json({ success: false, message: "Parent Not found" });
    }
  }

  // Login
  static async loginByUsername(req, res) {
    const { username, password } = req.body;


    // Validate Username
    if (!username || username.trim() === "") {
      res
          .status(200)
          .json({ success: false, message: "Please provide an username." });
      return;
    }

    // Validate Password
    if (!password || password.trim() === "") {
      res
          .status(200)
          .json({ success: false, message: "Please provide an password." });
      return;
    }

    // Fetch user with the email
    const userCheck = await GuardianService.getByColumnForLogin("userName", username);
    if (userCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this User NAme yet...",
      });
      return;
    }

    const [result] = userCheck.result;

    // Compare the passwords
    // console.log(result.password)
    // const passwordCheck = await GuardianService.getByColumnForLogin("password", password);
    if (result.password!=password) {
      res.status(200).json({
        success: false,
        message: "invalid credentials",
      });
      return;
    }

    // Data to send as API response
    const response = {
      id: result.id,
      role: "pickUpGuardian",
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
      token,
    });
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
  static async loginByEmail(req, res) {
    const { email } = req.body;

    // Validate Email
    if (!email || email.trim() === "") {
      res
          .status(200)
          .json({ success: false, message: "Please provide an email." });
      return;
    }



    // Fetch user with the email
    const userCheck = await GuardianService.getByColumn("email", email);
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
      role: "PARENT",
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
      token,
    });
  }
  // has email
  static async hasEmail(req, res) {
    const { userName } = req.params;

    if (userName) {
      const data = await GuardianService.getByColumn("userName", userName);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // check email
        const parent = data.result[0];
        res.status(200).json({ success: true, hasEmail: !!parent.email });
      }
    } else {
      res
          .status(200)
          .json({ success: false, message: "Please provide an user name." });
    }
  }

  // Get All
  static async getAll(_, res) {
    const data = await GuardianService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, parents: data.result });
    }
  }
  // Get By Id
  static async getById(req, res) {

    const { id } = req.params;

    if (id) {
      const data = await GuardianService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, parent: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    const { email } = req.body;

    const existingParentCheck = await GuardianService.getByColumn("email", email);

    if (!existingParentCheck.error) {
      res.status(200).json({
        success: false,
        message: "Parent already exists with this email.",
      });
      return;
    }

    const data = await GuardianService.create({ ...req.body });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, parent: data.result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await GuardianService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GuardianService.delete(id);
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res.status(200).json({ success: false, message: "Please provide an ID" });
    }
  }
};
