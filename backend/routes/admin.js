
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.route('/')
    .get(adminController.handleGetAllAdmins)
    .post(adminController.handleCreateAdmin)
    .put(adminController.handleUpdateAdmin)

router.route('/signup')
    .post(adminController.handleAdminSignup)


router.route('/:id')
    .get(adminController.handleGetAdmin)
    .delete(adminController.handleDeleteAdmin)

module.exports = router