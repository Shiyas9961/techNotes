const express = require('express')
const router = express.Router()
const loginLimiter = require('../middleware/rateLimiter')
const authController = require('../controllers/authControllers')

router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router