
import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { authMiddleware } from "../../../middleware/authMiddleware.js";
import { updateUserValidation } from "../validations/auth.validation.js";

const router = Router();

//USER ROUTES
// User registration
router.post("/signUp", UserController.signUp);

// User login
router.post("/login",UserController.login);

// Get user by id, email, name etc
router.get("/", authMiddleware, UserController.getUser);

router.patch("/me", authMiddleware, updateUserValidation, UserController.updateUser);

// router.post("/logout", authMiddleware, );

export default router;