const express = require('express');
const {getUsers, createUser, updateUser, deleteUser, getSingleUser} = require("../controllers/UserController");
const advancedResults = require("../middleware/advancedResult");
let User = require('../models/UserModel');
const {protect, authorized} = require("../middleware/auth");


const router = express.Router();
router.use(protect); // means everything will be protected
router.use(authorized('admin'));

router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser)

router.route('/:id')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router