const express = require('express');
const router = express.Router()
const clientController = require('../controllers/clientController')

router.route('/').post(clientController.createNewClientHandler)

module.exports = router