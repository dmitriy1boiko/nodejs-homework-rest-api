const express = require('express');
const ctrl = require('../../controllers/auth')
// const superagent = require('superagent');

const {validateBody, authenticate, upload} = require('../../middelwares');

const {schemas} = require('../../models/user')

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get('/verify/:verificationToken', ctrl.verifyUserEmail);

router.post(
  '/verify',
  validateBody(schemas.userEmailSchema),
  ctrl.resendVerifyEmail
);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router;