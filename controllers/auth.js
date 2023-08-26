const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');

const {User} = require('../models/user');

const { HttpError, ctrlWrapper } = require("../helpers");

const {SECRET_KEY}= process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async(req , res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
const avatarURL = gravatar.url(email, { s: '250' });

 const newUser = await User.create({...req.body, avatarURL, password:hashPassword, });
 console.log(newUser );
 res.status(201).json({
  user: {
    email: newUser.email,
    subscription: newUser.subscription,
  },
 })
};

const login = async(req , res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare ) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload ={
    id:user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY,{expiresIn:"23h"})
  await User.findByIdAndUpdate(user._id, { token });
 res.status(200).json({
  token: token,
  user: {
    email: user.email,
    subscription: user.subscription,
  },
})
};

const getCurrent = async (req, res, next) => {
  try {
		const { email, subscription } = req.user;
		if (!req.user) {
			throw HttpError(401, "Not authorized");
		}
		res.json({ email, subscription });
	} catch (error) {
		next(error);
	}
};

const logout = async(req, res) =>{
  const{_id} = req.user;
  await User.findByIdAndUpdate(_id, {token:''})
  res.status(204).json({
    message: 'Logout success',
  });
};

const updateAvatar = async(req, res) =>{
  const { _id } = req.user;  
  const { path: tempUpload, originalname } = req.file;
  const image = await jimp.read(tempUpload);
  await image.resize(250, 250);
  await image.writeAsync(tempUpload);

  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join('avatars', fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar:ctrlWrapper(updateAvatar),
};