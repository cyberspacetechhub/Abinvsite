const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

router.route('/')
    .get(tradeController.handleGetTrades)
    .put(tradeController.handleProcessDueTrades)
router.route('/pending')
    .get(tradeController.handleGetPendingTrades)
router.route('/rejected')
    .get(tradeController.handleGetRejectedTrades)
router.route('/due_trade')
    .get(tradeController.handleGetDueTrades)
router.route('/user/:id')
    .get(tradeController.handleGetProfits)

router.route('/add/:id')
    .put(tradeController.handleAddToUserBalance)
router.route('/remove/:id')
    .put(tradeController.handleRemoveFromUserBalance)
router.route('/profit/:id')
    .post(tradeController.handleAddToUserProfitBalance)
router.route('/reject/:id')
    .put(tradeController.handleRejectTrade)
router.route('/activities/:id')
    .get(tradeController.handleGetTradeActivities)
module.exports = router;