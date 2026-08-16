const InAppMessage = require('../models/InAppMessage');
const mongoose = require('mongoose');

// Create a generic message
const createMessage = async (data) => {
   try {
      const message = await InAppMessage.create({
          sender: data.sender,
          receiver: data.receiver,
          subject: data.subject,
          message: data.message
      });
      return message;
   } catch (err) {
      return { error: err.message };
   }
}

// Send a bonus message
const sendBonusMessage = async (userId, amount) => {
    // console.log(userId, amount);
    try {
        // Ensure the user exists

        const message = await InAppMessage.create({
            sender: new mongoose.Types.ObjectId('67ea68d9f0948ec11cddac12'),  // Replace with system or admin sender ID
            receiver: userId,
            subject: 'Bonus Received',
            message: `You have received a bonus of $${amount}. for referring a new user`
        });
        // console.log(message);
        return message;
    } catch (err) {
        return { error: err.message };
    }
}

// Send a profit message
const sendProfitMessage = async (userId, amount) => {
    try {
        const message = await InAppMessage.create({
            sender: new mongoose.Types.ObjectId('67ea68d9f0948ec11cddac12'),  // Replace with system or admin sender ID
            receiver: userId,
            subject: 'Profit Received',
            message: `You have received a profit of $${amount}. from today's trade`
        });
        return message;
    } catch (err) {
        return { error: err.message };
    }
}

const getMessageByReceiverId = async (receiverId) => {
    try {
        const messages = await InAppMessage.find({ receiver: receiverId }).populate('sender').exec();
        return messages;
    } catch (err) {
        return { error: err.message };
    }
}

const makrAllMessageAsRead = async (receiverId) => {
    try {
        const messages = await InAppMessage.updateMany({ receiver: receiverId }, { read: true });
        return messages;
    } catch (err) {
        return { error: err.message };
    }
}

const deleteNotif = async (id) => {
    try {
        const notif = await InAppMessage.findOne({_id: id});
        if (!notif) {
            return { error: 'Notification not found' };
        }
        const result = await notif.deleteOne({_id: id});
        return result;
    } catch (err) {
        return { error: err.message };
    }
}
module.exports = {
    createMessage,
    sendBonusMessage,
    sendProfitMessage,
    getMessageByReceiverId,
    makrAllMessageAsRead,
    deleteNotif
};
