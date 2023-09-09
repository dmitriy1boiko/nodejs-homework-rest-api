const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');
const {nanoid} = require('nanoid')
// const ElasticEmail = require('@elasticemail/elasticemail-client');

require("dotenv").config();
const {User} = require('../models/user');

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const {SECRET_KEY, BASE_URL}= process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
  const { email, password} = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }
  // if (!verify) {
  //   throw HttpError(401);
  // }
  const avatarURL = gravatar.url(email, { s: '250' });
  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email </a>`,
  };

  await sendEmail(verifyEmail);

  // const api = new ElasticEmail.EmailsApi();

  // const verifyEmail = ElasticEmail.EmailMessageData.constructFromObject({
  //   Recipients: [new ElasticEmail.EmailRecipient(email)],
  //   Content: {
  //     Body: [
  //       ElasticEmail.BodyPart.constructFromObject({
  //         ContentType: 'HTML',
  //         Content: `<a target='_blank' href='${BASE_URL}/users/verify/${verificationToken}' >Click to verify your email</a>`,
  //       }),
  //     ],
  //     Subject: 'Verify email',
  //     From: 'boikodmytro1@ukr.net',
  //   },
  // });

  // await api.emailsPost(verifyEmail, sendEmail);

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

const verifyUserEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: 'Verification successful',
  });
}

const login = async(req , res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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

const resendVerifyEmail = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			throw HttpError(401, "Email not found");
		}

		if (user.verify) {
			throw HttpError(400, "Verification has already been passed");
		}

		const verifyEmail = {
			to: email,
			subject: "Verify email",
			html: `<a target="blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email </a>`,
		};

		await sendEmail(verifyEmail);

		res.json({
			message: "Verification email sent ",
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
  register: ctrlWrapper(register),
  verifyUserEmail:ctrlWrapper(verifyUserEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar:ctrlWrapper(updateAvatar),
};