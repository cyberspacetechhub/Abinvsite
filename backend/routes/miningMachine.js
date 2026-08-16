const express = require('express');
const router = express.Router();
const c = require('../controllers/miningMachineController');

// Catalog (admin CRUD + public active list)
router.route('/')
    .get(c.handleGetMachines)
    .post(c.handleCreateMachine);

router.route('/active')
    .get(c.handleGetActiveMachines);

// Admin: manage a specific user's mining (must be before /:id)
router.route('/user/:userId')
    .get(c.handleGetUserMiningOverview);

router.route('/user/:userId/credit')
    .post(c.handleAdminCreditMining);

router.route('/user/:userId/deduct')
    .post(c.handleAdminDeductMining);

router.route('/user/:userId/start')
    .post(c.handleAdminForceStart);

router.route('/user/:userId/stop')
    .post(c.handleAdminForceStop);

router.route('/user/:userId/remove')
    .post(c.handleAdminRemoveUserMachine);

// Catalog by ID (must be after all /user/* routes)
router.route('/:id')
    .put(c.handleUpdateMachine)
    .delete(c.handleDeleteMachine);

module.exports = router;
