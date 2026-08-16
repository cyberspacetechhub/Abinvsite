

const {
    createWithdrawalMethod,
    getWithdrawalMethods,
    updateWithdrawalMethod,
    deleteWithdrawalMethod,
    getWithdrawalMethod,
    withdrawalMethodExists
} = require('../services/withdrawalMethodService')

const handleCreateWithdrawalMethod = async (req, res) => {
    const {name, description, minAmount, maxAmount} = req.body;
    if(!name, !description, !minAmount, !maxAmount) return res.status(400).json({error: 'All fields are required'})
    
    const duplicate = await withdrawalMethodExists(name)
    if(duplicate) return res.status(409).json({error: 'Withdrawal method already exists'})
    const data = req.body;

    const result = await createWithdrawalMethod(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(201).json({success: 'Withdrawal method created successfully', data: result})
}

const handleGetWithdrawalMethods = async (req, res) => {
    const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
    }
    const result = await getWithdrawalMethods(data)
    if(result.error) return res.status(500).json({error: result.error})
    
    return res.status(200).json(result)
}

const handleUpdateWithdrawalMethod = async (req, res) => {
    if(!req.body) return res.status(400).json({error: 'Data to update required'})
    
    const _id = req.body._id;
    const result = await updateWithdrawalMethod(_id, req.body)
    if(result.error) return res.status(500).json({error: result.error})

    return res.status(200).json({success: 'Withdrawal method updated successfully', data: result})
}

const handleDeleteWithdrawalMethod = async (req, res) => {
   if(!req.params.id) return res.status(400).json({error: 'Withdrawal method id required'})

    const _id = req.params.id;
    const result = await deleteWithdrawalMethod(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json({success: 'Withdrawal method deleted successfully', data: result})
}

const handleGetWithdrawalMethod = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Withdrawal method id required'})

    const _id = req.params.id;
    const result = await getWithdrawalMethod(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}

module.exports = {
    handleCreateWithdrawalMethod,
    handleGetWithdrawalMethods,
    handleUpdateWithdrawalMethod,
    handleDeleteWithdrawalMethod,
    handleGetWithdrawalMethod
}