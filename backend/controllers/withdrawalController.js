

const {
    getWithdrawals,
    createWithdrawal,
    getWithdrawal,
    withdrawalStatus,
    getWithdrawalsByUser
} = require('../services/withdrawalService');

const handleCreateWithdrawal = async (req, res) => {
    const {amount, user} = req.body;
    if(!amount || !user) return res.status(400).json({error: 'Amount and user are required'})
    
    const data = req.body
    const result = await createWithdrawal(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(201).json({success: 'Withdrawal created successfully', data: result})
}

const handleGetWithdrawals = async (req, res) => {
    const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
    }
    const result = await getWithdrawals(data)
    if(result.error) return res.status(500).json({error: result.error})
    
    return res.status(200).json(result)
}


const handleGetWithdrawal = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Withdrawal id required'})

    const _id = req.params.id;
    const result = await getWithdrawal(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json({success: 'Withdrawal fetched successfully', data: result})
}

const handleWithdrawalStatus = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Withdrawal id required'})

    const _id = req.params.id;
    const status = req.body.status;
    const result = await withdrawalStatus(_id, status)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}
const handleGetWithdrawalsByUser= async (req, res) => {
    // console.log(req.params.id)
    const data = {
      page: req.query.page,
      limit: req.query.limit,
      userId: req.params.id,
    };
    const withdrawals = await getWithdrawalsByUser(data);
    if (!withdrawals)
      return res.status(404).json({ message: "Withdrawals not found" });
    return res.status(200).json(withdrawals);
  };
module.exports = {
    handleCreateWithdrawal,
    handleGetWithdrawals,
    handleGetWithdrawal,
    handleWithdrawalStatus,
    handleGetWithdrawalsByUser
}