const express = require('express');
const router = express.Router();
const c = require('../controllers/serviceRequestController');

router.route('/')
    .get(c.handleGetAllServices)
    .post(c.handleCreateService);

router.route('/user/:userId')
    .get(c.handleGetServicesByUser);

router.route('/user/:userId/active')
    .get(c.handleGetActiveServices);

router.route('/:id')
    .put(c.handleUpdateService)
    .delete(c.handleDeleteService);

router.route('/:id/toggle')
    .post(c.handleToggleService);

router.route('/:id/resolve')
    .post(c.handleResolveService);

module.exports = router;
