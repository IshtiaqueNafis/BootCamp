const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout
} = require('../controllers/AuthController');
const {protect} = require("../middleware/auth");


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword)
router.put('/updatepassword', protect, updatePassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router;