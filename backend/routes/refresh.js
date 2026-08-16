

const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController'); 

router.route('/')
    .get(refreshTokenController.handleRefresh);
module.exports = router;