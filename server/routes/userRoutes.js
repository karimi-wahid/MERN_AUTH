import express from "express";
import { getUserData } from "../controllers/userController.js";
import userAuth from "../middleware/userAuthMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);

userRouter.get("/admin", userAuth, authorizeRoles("admin"), (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Admin access granted" });
});

export default userRouter;
