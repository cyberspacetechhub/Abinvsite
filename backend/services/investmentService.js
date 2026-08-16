

const Investment = require('../models/Investment');
const User = require('../models/User');
const InvestmentPlan = require('../models/InvestmentPlan');
const InAppMessage = require('../models/InAppMessage');
const Trade = require('../models/Trade');
const mongoose = require('mongoose');
const { createDailyProfit } = require('./tradeService');
const emailService = require('./emailService');
const { createNotification } = require('./notificationService');

const getInvestments = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 10;
    let skip = (page - 1) * limit;

    try{
        const investments = await Investment.find().sort({createdAt: -1}).skip(skip).limit(limit).exec()
        const count = await Investment.countDocuments();
        if(!investments) return {error: 'No investments found'}
        return {investments, page, totalPages: Math.ceil(count / limit)}
    } catch (error) {
        return {error: error.message}
    }
}

const newInvestment = async (data) => {
    const userId = new mongoose.Types.ObjectId(data.user);
    const depositMethodId = new mongoose.Types.ObjectId(data.depositMethod);
    const investmentPlanId = new mongoose.Types.ObjectId(data.investmentPlan);
    try{
        const investment = await Investment.create({
            amount: data.amount,
            depositMethod: depositMethodId,
            user: userId,
            investmentPlan: investmentPlanId
            
        })

        const client = await User.findById(userId)
        if(!client) return {error: 'Client not found'}
        client.transactions.push(investment._id)
        const result = await client.save()
        
        // Send notification for new investment
        await createNotification(
            userId,
            '💹 Investment Request Submitted',
            `Your investment of $${data.amount} has been submitted and is pending approval.`,
            'info'
        );
        
        return {investment, result}
    } catch (error) {
        // console.log(error)
        return {error: error.message}
    }
}

const investFromBalance = async (data) => {
    const userId = new mongoose.Types.ObjectId(data.user);
    const investmentPlanId = new mongoose.Types.ObjectId(data.investmentPlan);

    try {
        // Fetch the user
        const client = await User.findById(userId);
        if (!client) return { error: 'Client not found' };

        // Check if the user has enough trading balance
        if (client.tradingBalance < data.amount) {
            return { error: 'Insufficient trading balance' };
        }

        // Deduct the amount from the user's trading balance
        client.tradingBalance -= data.amount;
        client.pendingBalance += data.amount;

        // Create the investment
        const investment = await Investment.create({
            amount: data.amount,
            user: userId,
            investmentPlan: investmentPlanId,
            source: "Balance", // Indicate the source of funds
        });

        // Add investment to user's transactions
        client.transactions.push(investment._id);
        
        // Save the updated user
        await client.save();
        
        // Send notification for balance investment
        await createNotification(
            userId,
            '💹 Investment from Trading Balance',
            `Your investment of $${data.amount} from your trading balance has been submitted and is pending approval.`,
            'info'
        );

        return { investment, user: client };
    } catch (error) {
        // console.error(error);
        return { error: error.message };
    }
};


const getInvestment = async (id) => {
    try{
        const investment = await Investment.findOne({_id: id}).populate('investmentPlan').populate('depositMethod').exec()
        if(!investment) return {error: 'Investment not found'}
        return investment
    } catch (error) {
        return {error: error.message}
    }
}

const investmentStatus = async (id, status) => {
    try {
        const investment = await Investment.findById(id).populate('investmentPlan').populate('depositMethod').exec(); // Ensure full plan data
        if (!investment) return { error: 'Investment not found' };

        investment.status = status;
        const result = await investment.save();

        if (status === 'Approved') {
            const userId = investment.user; // Correctly use user ID from the investment
            const client = await User.findById(userId);
            if (!client) {
                return { error: "Client not found" };
            }

            client.tradingBalance += investment.amount;
            client.pendingBalance = 0;
            client.plan = investment.investmentPlan._id;
            await client.save();

            // console.log("userId:", userId); // This should log the correct user ID

            if (!investment.source == 'Balance') {
                const address = investment.depositMethod.value || 'Balance'
                const depositMethod = investment.depositMethod.name || investment.source
                const plan = investment.investmentPlan.name
                const duration = investment.investmentPlan.duration
                // console.log(plan)
                // console.log(duration)
                const response = await emailService.sendInvestmentMessage(client.email, investment.amount, investment._id, address, depositMethod, plan, duration);
            }

            // Send approval notification
            await createNotification(
                userId,
                '✅ Investment Approved',
                `Your investment of $${investment.amount} has been approved and is now active. Trading will begin shortly.`,
                'success'
            );
            
            // Pass the correct userId to createDailyProfit
            const res = await createDailyProfit(investment.investmentPlan, investment, userId);
            if (res.success) {
                return { success: true, message: 'Investment approved successfully' };
              } else {
                return { error: 'Failed to create daily profit' };
              }
           
        }

        return result; // Return result for non-approved status
    } catch (error) {
        // console.error(error);
        return { error: error.message };
    }
};

const getInvestmentsByUser = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 10;
    let skip = (page - 1) * limit;
    const userId = data.userId;

    if (!userId) {
      return { error: "User ID is required" };
    }
    try {
      const investments = await Investment.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("depositMethod")
        .populate("investmentPlan")
        .skip(skip)
        .limit(limit)
        .exec();
      const totalCount = await Investment.countDocuments();
      return { investments, page, totalPage: Math.ceil(totalCount / limit) };
    } catch (error) {
      return { error: error.message };
    }
  };

const upgradePlan = async (data) => {
    const { userId, newPlanId } = data;
    
    try {
        const user = await User.findById(userId).populate('plan');
        if (!user) return { error: 'User not found' };
        
        if (!user.plan) return { error: 'No current plan found. Please subscribe to a plan first.' };
        
        // Check for unprocessed trades
        const currentInvestment = await Investment.findOne({ user: userId, status: 'Approved' }).sort({ createdAt: -1 });
        if (currentInvestment) {
            const unprocessedTrades = await Trade.find({ 
                investment: currentInvestment._id, 
                processed: false 
            });
            
            if (unprocessedTrades.length > 0) {
                return { error: 'Cannot upgrade plan while you have unprocessed trades. Please wait for all trades to complete.' };
            }
        }
        
        const newPlan = await InvestmentPlan.findById(newPlanId);
        if (!newPlan) return { error: 'New plan not found' };
        
        // Check if current plan amount meets minimum of new plan
        if (user.tradingBalance < newPlan.minAmount) {
            return { error: `Insufficient balance. You need at least $${newPlan.minAmount} to upgrade to ${newPlan.name}` };
        }
        
        // Calculate 10% deposit requirement
        const requiredDeposit = newPlan.minAmount * 0.1;
        
        // Create in-app message
        const message = await InAppMessage.create({
            sender: new mongoose.Types.ObjectId('000000000000000000000000'), // System message
            receiver: userId,
            subject: 'Plan Upgrade Request',
            message: `Your request to upgrade to ${newPlan.name} has been received. Please make a fresh deposit of $${requiredDeposit.toFixed(2)} (10% of plan minimum) to complete the upgrade process. Your request is pending admin approval.`
        });
        
        // Set upgrade alert
        user.planUpgradeAlert = true;
        user.planUpgradeAlertMessage = `Upgrade to ${newPlan.name} pending. Deposit $${requiredDeposit.toFixed(2)} required.`;
        await user.save();
        
        return { 
            success: true, 
            message: 'Upgrade request submitted successfully',
            requiredDeposit: requiredDeposit.toFixed(2),
            newPlan: newPlan.name
        };
        
    } catch (error) {
        return { error: error.message };
    }
};

const approveUpgrade = async (data) => {
    const { userId, newPlanId, adminId } = data;
    
    try {
        const user = await User.findById(userId);
        if (!user) return { error: 'User not found' };
        
        const newPlan = await InvestmentPlan.findById(newPlanId);
        if (!newPlan) return { error: 'Plan not found' };
        
        // Update user plan
        user.plan = newPlanId;
        user.planUpgradeAlert = false;
        user.planUpgradeAlertMessage = '';
        await user.save();
        
        // Send approval message
        await InAppMessage.create({
            sender: adminId,
            receiver: userId,
            subject: 'Plan Upgrade Approved',
            message: `Congratulations! Your upgrade to ${newPlan.name} has been approved. You can now enjoy the benefits of your new plan.`
        });
        
        return { success: true, message: 'Plan upgrade approved successfully' };
        
    } catch (error) {
        return { error: error.message };
    }
};

const rejectUpgrade = async (data) => {
    const { userId, reason, adminId } = data;
    
    try {
        const user = await User.findById(userId);
        if (!user) return { error: 'User not found' };
        
        // Clear upgrade alert
        user.planUpgradeAlert = false;
        user.planUpgradeAlertMessage = '';
        await user.save();
        
        // Send rejection message
        await InAppMessage.create({
            sender: adminId,
            receiver: userId,
            subject: 'Plan Upgrade Rejected',
            message: `Your plan upgrade request has been rejected. Reason: ${reason || 'Requirements not met'}`
        });
        
        return { success: true, message: 'Plan upgrade rejected' };
        
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = {
    getInvestments,
    newInvestment,
    getInvestment,
    investmentStatus,
    getInvestmentsByUser,
    investFromBalance,
    upgradePlan,
    approveUpgrade,
    rejectUpgrade
}