import express from "express";
import {signUp,login,logOut} from "../controllers/auth.controllers.js"

const authRouter= express.Router();

authRouter.post("/signUp", signUp);
authRouter.post("/login",login)
authRouter.get("/logout",logOut);
export default authRouter;