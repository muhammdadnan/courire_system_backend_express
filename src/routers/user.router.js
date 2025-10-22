import express from "express";
import { getUserController, userController, deleteUserController } from "../controllers/user.controller.js";
import { authenticate_user } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { importexcel } from "../controllers/import.controller.js";

const router = express.Router();

// ✅ Authentication routes
router.get("/userInfo", authenticate_user, userController);
router.get("/all-users", authenticate_user, getUserController);
router.delete("/delete-user/:id", authenticate_user, deleteUserController);

// ✅ Use memoryStorage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Excel import route
router.post("/import-excel", upload.single("file"), importexcel);

export default router;
