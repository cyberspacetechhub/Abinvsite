const {
    createMessage,
    sendBonusMessage,
    sendProfitMessage,
    getMessageByReceiverId,
    makrAllMessageAsRead,
    deleteNotif
} = require('../services/inAppMessageService');

const handleCreateMessage = async (req, res) => {
    const { sender, receiver, subject, message } = req.body;
    if(!sender, !receiver, !subject, !message) return res.status(400).json({ message: 'Missing required fields' });
    const data = req.body;
    const result = await createMessage(data);
    if(result.error) return res.status(400).json({ message: result.error });
    return res.status(201).json({ message: 'Message sent successfully' });
};

const handleGetMessageByReceiverId = async (req, res) => {
    if(!req.params.id) return res.status(400).json({ message: 'Missing required fields' });
    const receiverId = req.params.id;
    const result = await getMessageByReceiverId(receiverId);
    if(result.error) return res.status(400).json({ message: result.error });
    return res.status(200).json({ message: 'Message retrieved successfully', result });
};

const handleMarkAllMessageAsRead = async (req, res) => {
    if(!req.params.id) return res.status(400).json({ message: 'Missing required fields' });
    const receiverId = req.params.id;
    const result = await makrAllMessageAsRead(receiverId);
    if(result.error) return res.status(400).json({ message: result.error });
    return res.status(200).json({ message: 'Messages marked read', result });
};

const handleDeleteNotif = async (req, res) => {
    if(!req.params.id) return res.status(400).json({ message: 'Missing required fields' });
    const id = req.params.id;
    const result = await deleteNotif(id);
    if(result.error) return res.status(400).json({ message: result.error });
    return res.status(200).json({ message: 'Notification deleted successfully', result });
};
module.exports = {
    handleCreateMessage,
    handleGetMessageByReceiverId,
    handleMarkAllMessageAsRead,
    handleDeleteNotif
}