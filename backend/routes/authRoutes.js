const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.get('/auto-login', authController.autoLogin);
router.post('/logout', authController.logout);

module.exports = router;
