const express = require('express');
const router = express.Router()
const messageReqController = require('../controllers/messageReqController')

router.route('/')
    .get(messageReqController.handleGetAllMessage)
    .post(messageReqController.handleSendMessage)

router.route('/:id')
    .get(messageReqController.handleGetMessage)
    .delete(messageReqController.handleDeleteMessage)

module.exports = router