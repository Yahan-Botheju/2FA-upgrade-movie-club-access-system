import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';

//@desc   Register User
//@route  POST /api/users/register
//@access Public
const userRegister = expressAsyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(404).json({ message: 'fields cannot be empty' });
	}

	const checkUser = await User.findOne({ username });

	if (checkUser) {
		return res.status(400).json({ message: 'user already exists' });
	}

	//hash the password
	const salt = await bcrypt.genSalt(13);
	const hashedPassword = await bcrypt.hash(password, salt);

	//register the user
	const registerUser = await User.create({
		username,
		password: hashedPassword,
	});

	res.status(201).json({
		message: 'user registered success',
		user: {
			id: registerUser._id,
			username: registerUser.username,
			refreshToken: registerUser.refreshToken,
		},
	});
});

//@desc   Login User
//@route  POST /api/users/login
//@access Private
const userLogin = expressAsyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(404).json({ message: 'fields cannot be empty' });
	}

	//check the user existance
	const checkUser = await User.findOne({ username });

	if (!checkUser) {
		return res.status(404).json({ message: 'user not found' });
	}

	//compare the password with db password
	const isPasswordMatch = await bcrypt.compare(password, checkUser.password);

	if (!isPasswordMatch) {
		return res.status(400).json({ message: 'invalid password' });
	}

	//generate access token and refresh token
	const refreshToken = generateRefreshToken(checkUser._id);
	const accessToken = generateAccessToken(checkUser._id);

	//save refresh token in db
	checkUser.refreshToken = refreshToken;
	await checkUser.save();

	//set access cookie
	res.cookie( 'accessToken', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 15 * 60 * 1000,
	});

	//set refresh cookie
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return res.status(200).json({
		message: 'user logged in',
		user: {
			id: checkUser._id,
			username: checkUser.username,
			access_token: accessToken,
		},
	});
});

//@desc   Refresh Access Token
//@route  POST /api/users/refresh
//@access Public
const refreshAccessToken = expressAsyncHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return res.status(400).json({ message: 'token not found' });
	}

	//check the token in db
	const checkToken = await User.findOne({ refreshToken });

	if (!checkToken) {
		return res.status(403).json({message:'token reuse defected, please relog'})
	}

	try {
		
		//verify the token
		const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

		//create the tokens
		const newAccessToken = generateAccessToken(checkToken.id)
		const newRefreshToken = generateRefreshToken(checkToken.id)

		//replace new refresh token in db
		checkToken.refreshToken = newRefreshToken;
		await checkToken.save();

		//set refresh token
		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		//set access token
		res.cookie('accessToken', newAccessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000
		});

		return res.status(200).json({message:'token roration success'})

	} catch (error) {
		checkToken.refreshToken = ''
		await checkToken.save();
		res.status(401).json({message:'token invalid'})
	}


});

//@desc   Refresh Access Token
//@route  POST /api/users/logout
//@access Public
const userLogout = expressAsyncHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return res.status(404).json({ message: 'Token not found' });
	}

	//find the user from db
	const findUser = await User.findOne({ refreshToken });

	if (!findUser) {
		return res.status(400).json({ message: 'user not found' });
	}

	//clear the refresh token from db
	findUser.refreshToken = '';
	await findUser.save();

	//clear access cookie
	res.clearCookie('accessToken', {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
	});

	//clear refresh cookie
	res.clearCookie('refreshToken', {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
	});

	return res.status(200).json({ message: 'user logout success' });
});

//generate refresh token
const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};

//generate access token
const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
};

export { userRegister, userLogin, refreshAccessToken, userLogout };
