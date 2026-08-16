const {
    getProfitsByUser,
    addToUserBalance,
    removeFromUserBalance,
    addToUserProfitBalance,
    getDueTrades,
    processDueTrades,
    getTrades,
    getPendingTrades,
    getRejectedTrades,
    rejectTrade,
    getTradeActivities
} = require('../services/tradeService')

// const handleProcessTrades = async (req, res) => {
//     const response = await processTrades()
//     if (response.error) {
//         return res.status(500).json({error: response.error})
//     }
//     return res.status(200).json(response)
// }
const handleGetProfits = async (req, res) => {
    const data = {
        userId: req.params.id
    }
    const response = await getProfitsByUser(data)
    if (response.error) {
        return res.status(400).json({error: response.error})
    }
    return res.status(200).json(response)
    
}

const handleAddToUserBalance = async(req, res) => {
    const data = {
        userId: req.params.id,
        amount: req.body.amount
    }
    const response = await addToUserBalance(data)
    if (response.error) {
        return res.status(400).json({error: response.error})
    }
    return res.status(200).json(response)
}

const handleRemoveFromUserBalance = async(req, res) => {
    const data = {
        userId: req.params.id,
        amount: req.body.amount
    }
    const response = await removeFromUserBalance(data)
    if (response.error) {
        return res.status(400).json({error: response.error})
    }
    return res.status(200).json(response)
}

const handleAddToUserProfitBalance = async(req, res) => {
    if(!req.params.id) return res.status(400).send('id is required')
    const _id = req.params.id
    const amount = req.body.amount
    const numericAmount = Number(amount);
    const result = await addToUserProfitBalance(_id, numericAmount)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

const handleGetDueTrades = async(req, res) => {
    const response = await getDueTrades()
    if (response.error) {
        return res.status(400).json({error: response.error})
    }
    return res.status(200).json(response)
}

const handleProcessDueTrades = async(req, res) => {
    try {
        const result = await processDueTrades();
        if (result.error) {
            res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ message: result.success || 'Trades processed successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}

const handleGetTrades = async(req, res) => {
    const response = await getTrades()
    if (response.error) {
        return res.status(400).json({error: response.error})
    }
    return res.status(200).json(response)
}

const handleRejectTrade = async(req, res) => {
    const tradeId = req.params.id;
    const response = await rejectTrade(tradeId);
    if (response.error) {
        return res.status(400).json({error: response.error});
    }
    return res.status(200).json(response);
}

const handleGetTradeActivities = async(req, res) => {
    const userId = req.params.id;
    const response = await getTradeActivities(userId);
    if (response.error) {
        return res.status(400).json({error: response.error});
    }
    return res.status(200).json(response);
}

const handleGetPendingTrades = async(req, res) => {
    const response = await getPendingTrades();
    if (response.error) {
        return res.status(400).json({error: response.error});
    }
    return res.status(200).json(response);
}

const handleGetRejectedTrades = async(req, res) => {
    const response = await getRejectedTrades();
    if (response.error) {
        return res.status(400).json({error: response.error});
    }
    return res.status(200).json(response);
}
module.exports = {
    handleGetProfits,
    handleAddToUserBalance,
    handleRemoveFromUserBalance,
    handleAddToUserProfitBalance,
    handleGetDueTrades,
    handleProcessDueTrades,
    handleGetTrades,
    handleGetPendingTrades,
    handleGetRejectedTrades,
    handleRejectTrade,
    handleGetTradeActivities
}