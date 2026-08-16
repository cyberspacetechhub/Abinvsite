const express = require('express');
const router = express.Router();
const inAppMessageController = require('../controllers/inAppMessageController');

router.route('/')
    .post(inAppMessageController.handleCreateMessage)

router.route('/receiver/:id').get(inAppMessageController.handleGetMessageByReceiverId)
router.route('/markall/:id').put(inAppMessageController.handleMarkAllMessageAsRead)
router.route('/:id').delete(inAppMessageController.handleDeleteNotif)

module.exports = router