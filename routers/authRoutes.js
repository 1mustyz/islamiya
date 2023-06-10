const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const Joi = require("joi");

router.get("/users", authController.get_all_users);
router.delete("/bye", authController.remove_all_users);
router.post("/signup", authController.Signup_post);
router.post("/login", authController.Login_post);
router.patch("/users/:id", authController.edit_user);

module.exports = router;
