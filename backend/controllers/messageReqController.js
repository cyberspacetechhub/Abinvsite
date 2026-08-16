const {
    getAllMessage,
    sendMessage,
    getMessage,
    deleteMessage
} = require('../services/messageReqService')

const handleGetAllMessage = async (req, res) => {
    const data = {
        page: req.query.page,
        limit: req.query.limit,
    }
    const result = await getAllMessage(data)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}

const handleSendMessage = async (req, res) => {
    const {name, email, phone, message} = req.body;
    if(!name, !email, !phone, !message) return res.status(400).json({error: 'All fields are required'})

    const data = req.body
    const result = await sendMessage(data)
    if(result.error) return res.status(500).json({error: result.error})

    return res.status(200).json(result)
}

const handleGetMessage = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Id is required'})
    const _id = req.params.id
    const result = await getMessage(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}

const handleDeleteMessage = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Id is required'})
    const _id = req.params.id
    const result = await deleteMessage(_id)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)

}

module.exports = {
    handleGetAllMessage,
    handleSendMessage,
    handleGetMessage,
    handleDeleteMessage
}