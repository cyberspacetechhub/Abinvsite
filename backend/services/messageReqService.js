const MessageRequest = require('../models/MessageRequest');

const getAllMessage = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 50;
    let skip = (page - 1) * limit;

    const messages = await MessageRequest.find().skip(skip).limit(limit);
    const total = await MessageRequest.countDocuments();

    const totalPages = Math.ceil(total / limit);

    return { messages, page, total, totalPages };
}

const sendMessage = async(data) => {
    try {
        const message = await MessageRequest.create(data)
        return message;
    } catch (err) {
        return {error: err.message}
    }
}

const getMessage = async (id) => {
    try {
        const message = await MessageRequest.findOne({_id: id}).exec()
        if(!message) return {error: "Message does not exist"}
        return message
    } catch (err) {
        return {error: err.message}
    }
}

const deleteMessage = async (id) => {
    try {
        const message = await MessageRequest.findOne({_id: id}).exec();
        if(!message) return {error: 'No Message found'}

        const result = await message.deleteOne({_id: id});
        return result;
    } catch (err) {
        return {error: err.message}
    }
}

module.exports = {
    getAllMessage,
    sendMessage,
    getMessage,
    deleteMessage
}