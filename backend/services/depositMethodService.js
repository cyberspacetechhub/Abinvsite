
const DepositMethod = require('../models/DepositMethod')

const createDepositMethod = async (data) => {
    try{
        const newDepositMethod = await DepositMethod.create({
            name: data.name,
            value: data.value,
            type: data.type,
            qrCode: data.qrCode,
            minAmount: data.minAmount,
            maxAmount: data.maxAmount,
            description: data.description
        })

        return newDepositMethod

    } catch (error) {
        return {error: error.message}
    }
}

const getDepositMethods = async (data) => {
    let page = data.page || 1
    let limit = data.limit || 10
    let skip = (page - 1) * limit
    try{
        const depositMethods = await DepositMethod.find().sort({createdAt: -1}).limit(limit).skip(skip).exec();
        const count = await DepositMethod.countDocuments();
        if(!depositMethods) return {error: 'Deposit methods not found'}

        return {depositMethods, page, totalPage: Math.ceil(count / limit)}

    } catch (error) {
        return {error: error.message}
    }
}

const updateDepositMethod = async (id, data) => {
    try{
        const depositMethod = await DepositMethod.findOne({_id: id}).exec()
        if(!depositMethod) return {error: 'Deposit method not found'}

        if(data.name) depositMethod.name = data.name
        if(data.value) depositMethod.value = data.value
        if(data.type) depositMethod.type = data.type
        if(data.qrCode) depositMethod.qrCode = data.qrCode
        if(data.minAmount) depositMethod.minAmount = data.minAmount
        if(data.maxAmount) depositMethod.maxAmount = data.maxAmount
        if(data.description) depositMethod.description = data.description

        const result = await depositMethod.save()

        return result

    } catch (error) {
        return {error: error.message}
    }
}

const deleteDepositMethod = async (id) => {
    try{
        const depositMethod = await DepositMethod.findOne({_id: id}).exec()
        if(!depositMethod) return {error: 'Deposit method not found'}

        const result = await depositMethod.deleteOne()

        return result

    } catch (error) {
        return {error: error.message}
    }
}

const getDepositMethod = async (id) => {
    try{
        const depositMethod = await DepositMethod.findOne({_id: id}).exec()
        if(!depositMethod) return {error: 'Deposit method not found'}

        return depositMethod

    } catch (error) {
        return {error: error.message}
    }
}

const depositMethodExists = async (name) => {
    try {
        const depositMethod = await DepositMethod.findOne({name}).exec()
        return depositMethod
    } catch (err) {
        return {error: err.message};
    }
}
module.exports = {
    createDepositMethod,
    getDepositMethods,
    updateDepositMethod,
    deleteDepositMethod,
    getDepositMethod,
    depositMethodExists
}