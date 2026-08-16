
const {
    sendPin,
    sendWelcomeMessage,
    sendDepositMessage,
    sendWithdrawalMessage
} = require('../services/emailService')


const handleSendPin = async (req, res) => {
    const { email } = req.body;
    const response = await sendPin(email);
    if(response.error){
        return res.status(400).json({ error: response.message });
    }
    res.status(200).json(response);
}

const handleSendWelcomeMessage = async (req, res) => {
    const { email } = req.body;
    const response = await sendWelcomeMessage(email);
    if(response.error){
        return res.status(400).json({ error: response.message });
    }
    res.status(200).json(response);
}

const handleSendDepositMessage = async (req, res) => {
    const { email, amount } = req.body;
    const response = await sendDepositMessage(email, amount);
    if(response.error){
        return res.status(400).json({ error: response.message });
    }
    res.status(200).json(response);
}
const handleSendWithdrawalMessage = async (req, res) => {
    const { email, amount } = req.body;
    const response = await sendWithdrawalMessage(email, amount);
    if(response.error){
        return res.status(400).json({ error: response.message });
    }
    res.status(200).json(response);
}
module.exports = {
    handleSendPin,
    handleSendWelcomeMessage,
    handleSendDepositMessage,
    handleSendWithdrawalMessage
}