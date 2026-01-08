import express from 'express';
import { registerUser, LoginUser } from "../controller/AuthController.js"

const router = express.Router();


router.post('/auth/register', registerUser);
router.post('/auth/login', LoginUser);




export default router;