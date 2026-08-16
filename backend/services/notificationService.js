const InAppMessage = require('../models/InAppMessage');
const Client = require('../models/Client');

const createNotification = async (userId, title, message, type = 'info') => {
  try {
    const notification = new InAppMessage({
      sender: new require('mongoose').Types.ObjectId('000000000000000000000000'), // System sender
      receiver: userId,
      subject: title,
      message,
      read: false
    });
    await notification.save();
    return { success: true, notification };
  } catch (error) {
    return { error: error.message };
  }
};

const notifyAllClients = async (title, message, type = 'info') => {
  try {
    const clients = await Client.find({ isActive: true });
    const notifications = [];
    
    for (const client of clients) {
      const notification = await createNotification(client._id, title, message, type);
      if (notification.success) {
        notifications.push(notification.notification);
      }
    }
    
    return { success: true, count: notifications.length };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  createNotification,
  notifyAllClients
};