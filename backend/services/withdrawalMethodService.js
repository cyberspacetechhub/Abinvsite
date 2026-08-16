
const WithdrwalMethod = require('../models/WithdrawalMethod')

const createWithdrawalMethod = async (data) => {
    try{
        const newWithdrawalMethod = await WithdrwalMethod.create({
            name: data.name,
            minAmount: data.minAmount,
            maxAmount: data.maxAmount,
            description: data.description
        })

        return newWithdrawalMethod

    } catch (error) {
        return {error: error.message}
    }
} 

const getWithdrawalMethods = async (data) => {
    let page = data.page || 1
    let limit = data.limit || 10
    let skip = (page - 1) * limit
    try{
        const withdrawalMethods = await WithdrwalMethod.find().sort({createdAt: -1}).limit(limit).skip(skip).exec();
        const count = await WithdrwalMethod.countDocuments();
        if(!withdrawalMethods) return {error: 'Withdrawal methods not found'}

        return {withdrawalMethods, page, totalPage: Math.ceil(count / limit)}

    } catch (error) {
        return {error: error.message}
    }
} 

const updateWithdrawalMethod = async (id, data) => {
    try{
        const withdrawalMethod = await WithdrwalMethod.findOne({_id: id}).exec()
        if(!withdrawalMethod) return {error: 'Withdrawal method not found'}

        if(data.name) withdrawalMethod.name = data.name
        if(data.value) withdrawalMethod.value = data.value
        if(data.minAmount) withdrawalMethod.minAmount = data.minAmount
        if(data.maxAmount) withdrawalMethod.maxAmount = data.maxAmount
        if(data.description) withdrawalMethod.description = data.description

        const result = await withdrawalMethod.save()

        return result

    } catch (error) {
        return {error: error.message}
    }
} 
const deleteWithdrawalMethod = async (id) => {
    try{
        const withdrawalMethod = await WithdrwalMethod.findOne({_id: id}).exec()
        if(!withdrawalMethod) return {error: 'Withdrawal method not found'}

        const result = await withdrawalMethod.deleteOne()

        return result

    } catch (error) {
        return {error: error.message}
    }
}

const getWithdrawalMethod = async (id) => {
    try{
        const withdrawalMethod = await WithdrwalMethod.findOne({_id: id}).exec()
        if(!withdrawalMethod) return {error: 'Withdrawal method not found'}

        return withdrawalMethod

    } catch (error) {
        return {error: error.message}
    }
}
const withdrawalMethodExists = async (name) => {
    try {
        const withdrawalMethod = await WithdrwalMethod.findOne({name}).exec()
        return withdrawalMethod
    } catch (err) {
        return {error: err.message};
    }
}

module.exports = {
    createWithdrawalMethod,
    getWithdrawalMethods,
    updateWithdrawalMethod,
    deleteWithdrawalMethod,
    getWithdrawalMethod,
    withdrawalMethodExists
}