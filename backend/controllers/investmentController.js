
const {
    getInvestments,
    newInvestment,
    getInvestment,
    investmentStatus,
    getInvestmentsByUser,
    investFromBalance,
    upgradePlan,
    approveUpgrade,
    rejectUpgrade
} = require('../services/investmentService');

const handleCreateInvestment = async (req, res) => {
    // console.log(req.body)
    const {amount, user, depositMethod, investmentPlan} = req.body;
    if(!amount, !user, !depositMethod, !investmentPlan) return res.status(400).json({error: 'All fields are required'})
    
    const data = req.body
    const result = await newInvestment(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(201).json({success: 'Investment created successfully', data: result})
}

const handleInvestFromBalance = async (req, res) => {
    const {amount, user, investmentPlan} = req.body;
    if(!amount, !user, !investmentPlan) return res.status(400).json({error: 'All fields are required'})
    const data = req.body
    const result = await investFromBalance(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(201).json({success: 'Investment created successfully', data: result})
}

const handleGetInvestments = async (req, res) => {
    const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
    }
    const result = await getInvestments(data)
    if(result.error) return res.status(500).json({error: result.error})
    
    return res.status(200).json(result)
}


const handleGetInvestment = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Investment id required'})

    const _id = req.params.id;
    const result = await getInvestment(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json({success: 'Investment fetched successfully', data: result})
}

const handleInvestmentStatus = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Investment id required'})

    const _id = req.params.id;
    const status = req.body.status;
    const result = await investmentStatus(_id, status)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json({success: 'Investment status updated successfully', data: result})
}
const handleGetInvestmentsByUser= async (req, res) => {
    // console.log(req.params.id)
    const data = {
      page: req.query.page,
      limit: req.query.limit,
      userId: req.params.id,
    };
    const investments = await getInvestmentsByUser(data);
    if (!investments)
      return res.status(404).json({ message: "Investment not found" });
    return res.status(200).json(investments);
  };
const handleUpgradePlan = async (req, res) => {
    const { userId, newPlanId } = req.body;
    if (!userId || !newPlanId) return res.status(400).json({ error: 'User ID and new plan ID are required' });
    
    const result = await upgradePlan({ userId, newPlanId });
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(200).json({ message: result.message, data: result });
};

const handleApproveUpgrade = async (req, res) => {
    const { userId, newPlanId, adminId } = req.body;
    if (!userId || !newPlanId || !adminId) return res.status(400).json({ error: 'User ID, plan ID, and admin ID are required' });
    
    const result = await approveUpgrade({ userId, newPlanId, adminId });
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(200).json({ message: result.message });
};

const handleRejectUpgrade = async (req, res) => {
    const { userId, reason, adminId } = req.body;
    if (!userId || !adminId) return res.status(400).json({ error: 'User ID and admin ID are required' });
    
    const result = await rejectUpgrade({ userId, reason, adminId });
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(200).json({ message: result.message });
};

module.exports = {
    handleCreateInvestment,
    handleGetInvestments,
    handleGetInvestment,
    handleInvestmentStatus,
    handleGetInvestmentsByUser,
    handleInvestFromBalance,
    handleUpgradePlan,
    handleApproveUpgrade,
    handleRejectUpgrade
}