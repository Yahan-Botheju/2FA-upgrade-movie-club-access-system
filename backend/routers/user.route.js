import express from 'express';
import { userRegister, userLogin, refreshAccessToken, userLogout } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router();

//Register User
router.post('/register', userRegister);

//Register User
router.post('/login', userLogin);

//Refresh Token route
router.post('/refresh', refreshAccessToken);

//Logout User
router.post('/logout', userLogout);


export default router;