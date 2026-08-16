
const {
    createDepositMethod,
    getDepositMethods,
    updateDepositMethod,
    deleteDepositMethod,
    getDepositMethod,
    depositMethodExists
} = require('../services/depositMethodService')

const handleCreateDepositMethod = async (req, res) => {
    const {name, description, minAmount, maxAmount, value} = req.body;
    if(!name, !description, !minAmount, !maxAmount, !value) return res.status(400).json({error: 'All fields are required'})
    
    const duplicate = await depositMethodExists(name)
    if(duplicate) return res.status(409).json({error: 'Deposit method already exists'})
    const data = req.body;

    const result = await createDepositMethod(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(201).json({success: 'Deposit method created successfully', data: result})
}

const handleGetDepositMethods = async (req, res) => {
    const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
    }
    const result = await getDepositMethods(data)
    if(result.error) return res.status(500).json({error: result.error})
    
    return res.status(200).json(result)
}

const handleUpdateDepositMethod = async (req, res) => {
    if(!req.body) return res.status(400).json({error: 'Data to update required'})
    
    const _id = req.body._id;
    const result = await updateDepositMethod(_id, req.body)
    if(result.error) return res.status(500).json({error: result.error})

    return res.status(200).json({success: 'Deposit method updated successfully', data: result})
}

const handleDeleteDepositMethod = async (req, res) => {
   if(!req.params.id) return res.status(400).json({error: 'Deposit method id required'})

    const _id = req.params.id;
    const result = await deleteDepositMethod(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json({success: 'Deposit method deleted successfully', data: result})
}

const handleGetDepositMethod = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Deposit method id required'})

    const _id = req.params.id;
    const result = await getDepositMethod(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}

module.exports = {
    handleCreateDepositMethod,
    handleGetDepositMethods,
    handleUpdateDepositMethod,
    handleDeleteDepositMethod,
    handleGetDepositMethod
}