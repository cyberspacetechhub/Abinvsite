
const {
    createInvestmentPlan,
    getInvestmentPlans,
    updateInvestmentPlans,
    deleteInvestmentPlan,
    getInvestmentPlan,
    investmentPlanExists
} = require('../services/investmentPlanService')

const handleCreateInvestmentPlan = async (req, res) => {
    const {name, minAmount, maxAmount, duration, interest, noOfTimes} = req.body;
    if(!name, !minAmount, !maxAmount, !duration, !interest, !noOfTimes) return res.status(400).json({error: 'All fields are required'})

    const duplicate = await investmentPlanExists(name)
    if(duplicate) return res.status(409).json({error: 'Investment plan already exists'})
    const data = req.body;

    const result = await createInvestmentPlan(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(201).json({success: 'Investment plan created successfully', data: result})
}

const handleGetInvestmentPlans = async (req, res) => {
    const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
    }
    const result = await getInvestmentPlans(data)
    if(result.error) return res.status(500).json({error: result.error})

    return res.status(200).json(result)
} 
const handleUpdateInvestmentPlan = async (req, res) => {
    if(!req.body) return res.status(400).json({error: 'Data to update required'})

    const _id = req.body._id;
    const result = await updateInvestmentPlans(_id, req.body)
    if(result.error) return res.status(500).json({error: result.error})

    return res.status(200).json({success: 'Investment plan updated successfully', data: result})
}


const handleDeleteInvestmentPlan = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Investment plan id required'})

    const _id = req.params.id;
    const result = await deleteInvestmentPlan(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json({success: 'Investment plan deleted successfully', data: result})
}

const handleGetInvestmentPlan = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Investment plan id required'})

    const _id = req.params.id;
    const result = await getInvestmentPlan(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}

module.exports = {
    handleCreateInvestmentPlan,
    handleGetInvestmentPlans,
    handleUpdateInvestmentPlan,
    handleDeleteInvestmentPlan,
    handleGetInvestmentPlan
}