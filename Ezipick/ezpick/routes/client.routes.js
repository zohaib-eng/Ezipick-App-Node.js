const { ClientController } = require("../controllers");

const express = require("express");
const router = express.Router();

router.get("/", ClientController.getAll);
router.get("/:id", ClientController.getById);
router.put("/create", ClientController.create);
router.patch("/update", ClientController.update);
router.delete("/:id", ClientController.delete);

// ** Auth Routes
router.post("/login", ClientController.login);
router.post("/sendNotification", ClientController.sendNotification);
router.patch("/update-password", ClientController.updatePassword);

module.exports = router;
