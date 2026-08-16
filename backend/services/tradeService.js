const Trade = require('../models/Trade')
const Client = require('../models/Client');
const cron = require('node-cron');

const createDailyProfit = async (investmentPlan, investment, userId) => {
  try {
    const dailyProfit = (investment.amount * (investmentPlan.interest / 100)) / investmentPlan.duration;
    const approvalDate = new Date();

    const client = await Client.findById(userId);
    if (!client) {
      return { error: "Client not found" };
    }

    for (let i = 0; i < investmentPlan.duration; i++) {
      const dueDate = new Date(approvalDate);
      dueDate.setDate(dueDate.getDate() + i + 1);

      await Trade.create({
        client: userId,
        amount: dailyProfit,
        dueDate,
        processed: false,
        investment: investment._id,
      });
    }

    return { success: "Daily profit schedule created." };
  } catch (err) {
    throw new Error(`Error creating daily profit schedule: ${err.message}`);
  }
};


const getProfitsByUser = async (data) => {
  const userId = data.userId;
  if(!userId){
    return {error: "User Id required"}
  }
  try {
    // Fetch profits that are either unprocessed or due (you can adjust the condition)
    const profits = await Trade.find({ client: userId, processed: true })
      .sort({ dueDate: 1 }) // Sort by dueDate to ensure they're in order
      .select('amount dueDate processed'); // Return only the relevant fields

    if (!profits) {
      return { message: 'No pending profits found.' };
    }

    return profits; // Return the list of profits
  } catch (err) {
    return {error: err.message}
  }
};

const addToUserBalance = async (userId, amount) => {
  try {
    const user = await Client.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }
      const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Invalid amount');
    }
    
    user.balance += numericAmount;

    await user.save();
    return { success: "Balance updated successfully" };
  } catch (err) {
    return { error: err.message };
  }
}

const removeFromUserBalance = async (userId, amount) => {
  try {
    const user = await Client.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }
    user.balance -= amount;
    await user.save();
    return { success: "Balance updated successfully" };
  } catch (err) {
    return { error: err.message };
  }
}

const addToUserProfitBalance = async(userId, amount) => {
  try {
    const user = await Client.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }
    const numericAmount = Number(amount);
    user.profitBalance += numericAmount;
    user.balance += numericAmount;
    await user.save();
    return { success: "Balance updated successfully" };
  } catch (err) {
    return { error: err.message };
  }

}

const getDueTrades = async () => {
  try {
    const dueTrades = await Trade.find({ dueDate: { $lte: new Date() }, processed: false });
    return dueTrades;
  } catch (err) {
    return { error: err.message };
  }
}

const processDueTrades = async () => {
  try {
      const dueTrades = await Trade.find({ 
          dueDate: { $lte: new Date() }, 
          processed: false 
      });

      if (dueTrades.length === 0) {
          return { message: "No due trades to process." };
      }

      for (const trade of dueTrades) {
          const client = await Client.findById(trade.client);
          if (client) {
              client.profitBalance = (client.profitBalance || 0) + trade.amount;
              client.balance += trade.amount;
              await client.save();
          }

          trade.processed = true;
          trade.processedAt = new Date();
          await trade.save();
      }

      return { success: "All due trades processed successfully." };
  } catch (err) {
      throw new Error(err.message);
  }
};

// Delete trades older than 90 days to preserve history
const cleanupOldTrades = async () => {
  try {
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const result = await Trade.deleteMany({
      processed: true,
      processedAt: { $lt: cutoffDate }
    });
    return { success: `Deleted ${result.deletedCount} old trades` };
  } catch (error) {
    return { error: error.message };
  }
};

const getTradeActivities = async (userId) => {
  try {
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activities = await Trade.find({
      client: userId,
      processed: true,
      processedAt: { $gte: last30Days }
    })
    .populate({
      path: 'investment',
      populate: {
        path: 'investmentPlan',
        model: 'InvestmentPlan'
      }
    })
    .sort({ processedAt: -1 });

    const user = await Client.findById(userId);
    const totalProfit = activities
      .filter(t => !t.rejected)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalLoss = activities
      .filter(t => t.rejected)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      activities: activities.map(activity => ({
        ...activity.toObject(),
        type: activity.rejected ? 'loss' : 'profit'
      })),
      summary: {
        totalProfit,
        totalLoss,
        netPL: totalProfit - totalLoss
      }
    };
  } catch (error) {
    return { error: error.message };
  }
};

// Cleanup old trades every 6 hours
cron.schedule('0 */6 * * *', async () => {
  try {
    await cleanupOldTrades();
  } catch (error) {
    console.error('Error cleaning up trades:', error.message);
  }
});

const rejectTrade = async (tradeId) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(tradeId)) {
      return { error: 'Invalid trade ID format' };
    }
    
    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return { error: 'Trade not found' };
    }
    
    if (trade.processed) {
      return { error: 'Trade already processed' };
    }
    
    // Update user loss balance
    const user = await Client.findById(trade.client);
    if (user) {
      user.lossBalance = (user.lossBalance || 0) + trade.amount;
      await user.save();
    }
    
    // Mark as processed and rejected
    trade.processed = true;
    trade.rejected = true;
    trade.processedAt = new Date();
    await trade.save();
    
    return { success: 'Trade rejected successfully' };
  } catch (error) {
    return { error: error.message };
  }
};

const getTrades = async () => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });
    if (!trades) {
      return { error: "No trades found" };
    }
    return trades;
  } catch (err) {
    return { error: err.message };
  }
}

const getPendingTrades = async () => {
  try {
    const trades = await Trade.find({ processed: false }).sort({ createdAt: -1 });
    return trades;
  } catch (err) {
    return { error: err.message };
  }
}

const getRejectedTrades = async () => {
  try {
    const trades = await Trade.find({ rejected: true, processed: true }).sort({ processedAt: -1 });
    return trades;
  } catch (err) {
    return { error: err.message };
  }
}

  module.exports = {
    createDailyProfit,
    getProfitsByUser,
    addToUserBalance,
    removeFromUserBalance,
    addToUserProfitBalance,
    getDueTrades,
    processDueTrades,
    getTrades,
    getPendingTrades,
    getRejectedTrades,
    rejectTrade,
    cleanupOldTrades,
    getTradeActivities
  }
  