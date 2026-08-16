
const {
    getDeposits,
    createDeposit,
    getDeposit,
    depositStatus,
    getDepositsByUser
} = require('../services/depositService');

const handleCreateDeposit = async (req, res) => {
    const {amount, user, depositMethod} = req.body;
    if(!amount, !user, !depositMethod) return res.status(400).json({error: 'All fields are required'})
    
    const data = req.body
    const result = await createDeposit(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(201).json({success: 'Deposit created successfully', data: result})
}

const handleGetDeposits = async (req, res) => {
    const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
    }
    const result = await getDeposits(data)
    if(result.error) return res.status(500).json({error: result.error})
    
    return res.status(200).json(result)
}


const handleGetDeposit = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Deposit id required'})

    const _id = req.params.id;
    const result = await getDeposit(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}

const handleDepositStatus = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Deposit id required'})

    const _id = req.params.id;
    const status = req.body.status;
    const result = await depositStatus(_id, status)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json({success: 'Deposit status updated successfully', data: result})
}
const handleGetDepositsByUser= async (req, res) => {
    // console.log(req.params.id)
    const data = {
      page: req.query.page,
      limit: req.query.limit,
      userId: req.params.id,
    };
    const deposits = await getDepositsByUser(data);
    if (!deposits)
      return res.status(404).json({ message: "Deposit not found" });
    return res.status(200).json(deposits);
  };

module.exports = {
    handleCreateDeposit,
    handleGetDeposits,
    handleGetDeposit,
    handleDepositStatus,
    handleGetDepositsByUser

}