
const InvestmentPlan = require('../models/InvestmentPlan');

const createInvestmentPlan = async (data) => {
    try{
        const investmentPlan = await InvestmentPlan.create({
            name: data.name,
            minAmount: data.minAmount,
            maxAmount: data.maxAmount,
            duration: data.duration,
            interest: data.interest,
            noOfTimes: data.noOfTimes || 1
        })

        return investmentPlan
    }catch (error){
        return {error: error.message}
    }
};

const getInvestmentPlans = async (data) => {
    let page = parseInt(data.page) || 1;
    let limit = parseInt(data.limit) || 5;
    let skip = ( page -1 ) * limit

    try {
        const investmentPlans = await InvestmentPlan.find().skip(skip).limit(limit).exec();
        const count = await InvestmentPlan.countDocuments();
        if(!investmentPlans) return {error: 'No admins found'}
        return {investmentPlans, page, count};
    } catch (err) {
        return {error: err.message}
    }
}

const updateInvestmentPlans = async (id, data) => {

    try{
        const investmentPlan = await InvestmentPlan.findOne({_id: id}).exec();
        if(!investmentPlan) return {error: "Investment plan not found"}

        if (data.name) investmentPlan.name = data.name
        if (data.minAmount) investmentPlan.minAmount = data.minAmount
        if (data.maxAmount) investmentPlan.maxAmount = data.maxAmount
        if (data.interest) investmentPlan.interest = data.interest
        if (data.duration) investmentPlan.duration = data.duration

        const result = await investmentPlan.save()
        return result
    } catch (err) {
        return {err: err.message}
    }
}

const deleteInvestmentPlan = async (id) => {
    try{
        const investmentPlan = await InvestmentPlan.findOne({_id: id}).exec();
        if(!investmentPlan) return {error: "Investment plan not found"}

        const result = await investmentPlan.deleteOne()
        return result
    } catch (err) {
        return {err: err.message}
    }
}

const getInvestmentPlan = async (id) => {
    try{
        const investmentPlan = await InvestmentPlan.findOne({_id: id}).exec();
        if(!investmentPlan) return {error: "Investment plan not found"}

        return investmentPlan
    } catch (err) {
        return {err: err.message}
    }
}

const investmentPlanExists = async (name) => {
    try {
        const investmentPlan = await InvestmentPlan.findOne({name}).exec()
        return investmentPlan
    } catch (err) {
        return {error: err.message};
    }
}

module.exports = {
    createInvestmentPlan,
    getInvestmentPlans,
    updateInvestmentPlans,
    deleteInvestmentPlan,
    getInvestmentPlan,
    investmentPlanExists
}