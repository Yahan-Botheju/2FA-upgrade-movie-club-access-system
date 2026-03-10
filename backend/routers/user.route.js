import express from 'express';
import { userRegister, userLogin, refreshAccessToken, userLogout, setup2FA, verify2fa, login2FAConfirm } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router();

//Register User
router.post('/register', userRegister);

//Register User
router.post('/login', userLogin);

//Refresh Token route
router.post('/refresh', refreshAccessToken);

/* 2FA routes */
//set up route
router.post('/2fa/setup', protect, setup2FA)

//verify route
router.post('/2fa/verify', protect,  verify2fa)

//confrim 2FA
router.post('/login/2fa-confirm', login2FAConfirm)

//Logout User
router.post('/logout', userLogout);


export default router;