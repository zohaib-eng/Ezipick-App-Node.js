// Package Imports
const bcrypt = require("bcryptjs");
const fcmNode = require("fcm-node")
const jwt = require("jsonwebtoken");
// Local Imports
const { hash } = require("../utils/bcrypt");

const { fcm } = require("../utils/fcm");
const { ClientService } = require("../services");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = class {
  // Update Password
  static async updatePassword(req, res) {
    const { id, password } = req.body;

    const hashedPassword = await hash(password);

    const data = await ClientService.update(id, {
      password: hashedPassword,
    });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true });
    }
  }
  static async sendNotification(req, res) {
    const { registrationToken, title,body,data } = req.body;
    const sendNotification = await fcm('',registrationToken,title,body,data);

    if (sendNotification) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed."  });
    } else {
      res.status(200).json({ success: true });
    }
  }

  // Login
  static async login(req, res) {
    const { email, password } = req.body;

    // Validate Email
    if (!email || email.trim() === "") {
      res
        .status(200)
        .json({ success: false, message: "Please provide an email." });
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
    const emailCheck = await ClientService.getByColumn("email", email);
    if (emailCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this Email yet...",
      });
      return;
    }

    const [result] = emailCheck.result;

    // Compare the passwords
    const isPasswordCorrect = await bcrypt.compare(password, result.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
      return;
    }

    // Data to send as API response
    const response = {
      id: result.id,
      email: result.email,
      name: result.name,
      role:'CLIENT',
    };

    // Generate JWT Token
    const token = jwt.sign(response, JWT_SECRET);

    // Final Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: response,
      token,
    });
  }

  // Get All
  static async getAll(_, res) {
    const data = await ClientService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.json({ success: true, clients: data.result });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await ClientService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, client: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    const { email, password, ...rest } = req.body;

    if (!email) {
      res
        .status(200)
        .json({ success: false, message: "Please provide an email." });
      return;
    }

    const existingUserCheck = await ClientService.getByColumn("email", email);

    if (!existingUserCheck.error) {
      res.json({ success: true, message: "Email Already Registered." });
      return;
    }

    const hashedPassword = await hash(password);

    const data = await ClientService.create({
      password: hashedPassword,
      email,
      ...rest,
    });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(201).json({ success: true, client: data.result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, password, ...rest } = req.body;

    if (id) {
      const data = await ClientService.update(id, { ...rest });
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
      const data = await ClientService.delete(id);
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
