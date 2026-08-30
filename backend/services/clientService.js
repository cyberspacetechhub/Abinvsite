const Client = require('../models/Client');
const MiningMachine = require('../models/MiningMachine');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const emailService = require('./emailService');
const userService = require('./userService');
const inAppMessageService = require('./inAppMessageService');
const InAppMessage = require('../models/InAppMessage');

const getAllClients = async(data) => {
    let page = parseInt(data.page) || 1;
    let limit = parseInt(data.limit) || 10;
    let skip = (page - 1) * limit
    try {
        const clients = await Client.find().sort({createdAt: -1}).populate('transactions').populate('plan').skip(skip).limit(limit).exec();
        const count = await Client.countDocuments();
        
        // Calculate global statistics
        const activeCount = await Client.countDocuments({ isActive: true });
        const verifiedCount = await Client.countDocuments({ isVerified: true });
        
        const Transaction = require('../models/Transaction');
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        
        const transactionStats = {
            totalDeposit: 0,
            totalWithdrawal: 0,
            totalInvestment: 0,
            totalTransactions: 0
        };
        
        stats.forEach(stat => {
            if (stat._id === 'Deposit') transactionStats.totalDeposit = stat.totalAmount;
            else if (stat._id === 'Withdrawal') transactionStats.totalWithdrawal = stat.totalAmount;
            else if (stat._id === 'Investment') transactionStats.totalInvestment = stat.totalAmount;
        });
        transactionStats.totalTransactions = transactionStats.totalDeposit + transactionStats.totalWithdrawal + transactionStats.totalInvestment;

        if(!clients) return {error: 'No clients found'}
        return {
            clients,
            page,
            count,
            totalPage: Math.ceil(count / limit),
            activeCount,
            verifiedCount,
            ...transactionStats
        };
    } catch (err) {
        return {error: err.message}
    }
};

const createNewClient = async (data) => {
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Generate referral code for the new client
        const referralCode = await userService.generateReferralCode();

        // Initialize referrer as null
        let referrer = null;

        // If the client provided a referral code, check if the referrer exists
        if (data.referralCode) {
            referrer = await Client.findOne({ referralCode: data.referralCode }).exec();

            // If the referrer does not exist, return an error
            if (!referrer) {
                return { error: 'Referral code not found' };
            }
        }

        // Create the new client
        const newClient = await Client.create({
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            phone: data.phone,
            email: data.email,
            address: data.address,
            country: data.country,
            referralCode: referralCode,
            referrer: referrer ? referrer._id : null, // Store referrer ID if available
            password: hashedPassword,
            unhashedPswd: data.password,
            searchString: `${data.firstname} ${data.lastname} ${data.email} ${data.phone} ${data.username}`,
        });

        // If there is a referrer, process the referral bonus
        if (referrer) {
            const bonusAmount = 50;
        
            // Update bonus and balance
            referrer.bonus = (referrer.bonus || 0) + bonusAmount;
            referrer.balance += bonusAmount;
        
            // Create a transaction record for the bonus
            // referrer.transactions.push({
            //     amount: bonusAmount,
            //     type: 'Bonus',
            //     status: 'completed',
            //     description: `Bonus for referral of ${newClient.username}`
            // });
        
            // console.log(referrer.transactions);
            // console.log(referrer._id)
            await inAppMessageService.sendBonusMessage(referrer._id, bonusAmount);
    
            // console.log('message sent')
            // Save the updated referrer data
            await referrer.save();
        }        

        // Send the welcome email to the new client
        const res = await emailService.sendWelcomeMessage(newClient.email, newClient.username);

        return newClient; // Return the newly created client
    } catch (err) {
        return { error: err.message }; // Return error message if something fails
    }
};



const updateClient = async(id, data) => {
    try {
        const client = await Client.findOne({_id: id}).exec()
        if(!client) return {error: 'Client not found'}
        if(data.firstname) client.firstname = data.firstname
        if(data.lastname) client.lastname = data.lastname
        if(data.email) client.email = data.email
        if(data.phone) client.phone = data.phone
        if(data.username) client.username = data.username
        if(data.address) client.address = data.address
        if(data.country) client.country = data.country
        
        const result = await client.save()
        return result
    } catch (err) {
        // console.log(err)
        return {error: err.message};
    }
};

const deleteClient = async(id) => {
    try {
        const client = await Client.findOne({_id: id}).exec()
        if(!client) return {error: 'Client not found'}
        const result = await client.deleteOne()
        return result
    } catch (err) {
        return {error: err.message};
    }
};

const getClient = async(id) => {
    try {
        const client = await Client.findOne({_id: id}).populate('transactions').populate('plan').populate('referrer', 'firstname lastname email username').exec()
        if(!client) return {error: 'Client not found'}
        return client
    } catch (err) {
        return {error: err.message};
    }
};

const clientExists = async(username) => {
    try {
        const client = await Client.findOne({username: username}).exec()
        return client
    } catch (err) {
        return {error: err.message};
    }
};

const verifyClient = async(id) => {
    try{
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.isVerified = true;
        await client.save();
        return client;

    } catch (e) {
        return {error: e.message}
    }
}

const unverifyClient = async(id) => {
    try{
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.isVerified = false;
        await client.save();
        return client;

    } catch (e) {
        return {error: e.message}
    }
}

const searchClients = async (query) => {
    try {
        if (!query) {
            return { error: "Search query is required" };
        }

        // Perform case-insensitive search using searchString
        const users = await Client.find({
            searchString: { $regex: query, $options: "i" }
        }).limit(10); // Limit results to improve performance

        return users;
    } catch (e) {
        return { error: e.message };
    }
};

const totalUserBalance = async () => {
    try {
        const totalBalance = await Client.aggregate([
            {
                $group: {
                    _id: null,
                    totalBalance: { $sum: "$balance" }
                }
            }
        ]);

        return totalBalance.length > 0 ? totalBalance[0].totalBalance : 0;
    } catch (error) {
        throw new Error(error.message);
    }
};

const onMaintenanceAlert = async (id, data) => {
    try {
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.maintenanceAlert = true
        client.maintenanceAlertMessage = data.message
        await client.save()
        // console.log(client)
        const mceMessage = await InAppMessage.create({
            sender: data.sender,
            receiver: client._id,
            message: data.message,
            subject: 'Maintenance Alert'
        });
        return mceMessage
    } catch (e) {
        return {error: e.message}
    }
}

const offMaintenanceAlert = async (id) => {
    try {
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.maintenanceAlert = false
        await client.save()
        return client
    } catch (e) {
        return {error: e.message}
    }
}

const onSecurityAlert = async (id, data) => {
    try {
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.securityAlert = true
        client.securityAlertMessage = data.message
        await client.save()
        const secMessage = await InAppMessage.create({
            sender: data.sender,
            receiver: client._id,
            message: data.message,
            subject: 'Security Alert'
        });
        return secMessage

    } catch (e) {
        return {error: e.message}
    }
}

const offSecurityAlert = async (id) => {
    try {
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.securityAlert = false
        await client.save()
        return client
    } catch (e) {
        return {error: e.message}
    }
}

const onPlanUpgradeAlert = async (id, data) => {
    try {
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.planUpgradeAlert = true
        client.planUpgradeAlertMessage = data.message
        await client.save()
        const planMessage = await InAppMessage.create({
            sender: data.sender,
            receiver: client._id,
            message: data.message,
            subject: 'Plan Upgrade Alert'
        });
        return planMessage

    } catch (e) {
        return {error: e.message}
    }
}

const offPlanUpgradeAlert = async (id) => {
    try {
        const client = await Client.findOne({_id: id}).exec();
        if(!client) return {error: "Client not found"};
        client.planUpgradeAlert = false
        await client.save()
        return client
    } catch (e) {
        return {error: e.message}
    }
}
const transferFunds = async (id, { from, to, amount }) => {
    try {
        const client = await Client.findById(id).exec()
        if (!client) return { error: 'Client not found' }
        const amt = parseFloat(amount)
        if (!amt || amt <= 0) return { error: 'Invalid amount' }
        if (amt < 10) return { error: 'Minimum transfer amount is $10' }
        const accountMap = { funding: 'balance', trading: 'tradingBalance', mining: 'miningBalance' }
        const fromField = accountMap[from]
        const toField   = accountMap[to]
        if (!fromField || !toField || fromField === toField)
            return { error: 'Invalid transfer accounts' }
        if (client[fromField] < amt)
            return { error: `Insufficient funds in ${from} account` }

        // Block transfer from trading if there's an active investment with pending trades
        if (from === 'trading') {
            const Investment = require('../models/Investment')
            const Trade = require('../models/Trade')
            const activeInvestment = await Investment.findOne({ user: id, status: 'Approved' }).exec()
            if (activeInvestment) {
                const pendingTrades = await Trade.countDocuments({
                    investment: activeInvestment._id,
                    processed: false,
                    rejected: false
                })
                if (pendingTrades > 0)
                    return { error: `Transfer locked: you have ${pendingTrades} pending trade${pendingTrades !== 1 ? 's' : ''} on your active investment plan. Wait for all trades to complete.` }
            }
        }

        client[fromField] -= amt
        client[toField]   += amt
        await client.save()
        return { success: true, balance: client.balance, tradingBalance: client.tradingBalance, miningBalance: client.miningBalance }
    } catch (e) {
        return { error: e.message }
    }
}

const getMachines = async (id) => {
    try {
        const client = await Client.findById(id).exec()
        if (!client) return { error: 'Client not found' }
        const catalog = await MiningMachine.find({ isActive: true }).sort({ price: 1 })
        return { catalog, owned: client.miningMachines, miningBalance: client.miningBalance }
    } catch (e) {
        return { error: e.message }
    }
}

const buyMachine = async (id, { machineId }) => {
    try {
        const client = await Client.findById(id).exec()
        if (!client) return { error: 'Client not found' }
        const machine = await MiningMachine.findOne({ machineId, isActive: true })
        if (!machine) return { error: 'Machine not found or unavailable' }
        if (client.miningBalance < machine.price)
            return { error: 'Insufficient mining balance' }
        client.miningBalance -= machine.price
        client.miningMachines.push({
            machineId: machine.machineId,
            name: machine.name,
            hashrate: machine.hashrate,
            price: machine.price,
            status: 'idle',
            totalMined: 0
        })
        await client.save()
        return { success: true, miningBalance: client.miningBalance, machines: client.miningMachines }
    } catch (e) {
        return { error: e.message }
    }
}

const startMachine = async (id, { index }) => {
    try {
        const client = await Client.findById(id).exec()
        if (!client) return { error: 'Client not found' }
        const machine = client.miningMachines[index]
        if (!machine) return { error: 'Machine not found' }
        if (machine.status === 'running') return { error: 'Machine already running' }
        machine.status = 'running'
        machine.startedAt = new Date()
        await client.save()
        return { success: true, machines: client.miningMachines }
    } catch (e) {
        return { error: e.message }
    }
}

const setWithdrawalLimit = async (id, limit) => {
    try {
        const client = await Client.findById(id).exec()
        if (!client) return { error: 'Client not found' }
        client.withdrawalLimit = parseFloat(limit)
        await client.save()
        return { success: true, withdrawalLimit: client.withdrawalLimit }
    } catch (e) {
        return { error: e.message }
    }
}

const stopMachine = async (id, { index }) => {    try {
        const client = await Client.findById(id).exec()
        if (!client) return { error: 'Client not found' }
        const machine = client.miningMachines[index]
        if (!machine) return { error: 'Machine not found' }
        if (machine.status !== 'running') return { error: 'Machine is not running' }
        const catalog = await MiningMachine.findOne({ machineId: machine.machineId })
        const dailyRate = catalog ? catalog.dailyRate : 0.5
        const hoursRun = (Date.now() - new Date(machine.startedAt).getTime()) / (1000 * 60 * 60)
        const earned = parseFloat(((hoursRun / 24) * dailyRate).toFixed(4))
        machine.status = 'stopped'
        machine.totalMined = parseFloat(((machine.totalMined || 0) + earned).toFixed(4))
        client.miningBalance = parseFloat((client.miningBalance + earned).toFixed(4))
        await client.save()
        return { success: true, earned, miningBalance: client.miningBalance, machines: client.miningMachines }
    } catch (e) {
        return { error: e.message }
    }
}

module.exports = {
    getAllClients,
    createNewClient,
    updateClient,
    deleteClient,
    getClient,
    clientExists,
    verifyClient,
    unverifyClient,
    searchClients,
    onMaintenanceAlert,
    offMaintenanceAlert,
    onSecurityAlert,
    offSecurityAlert,
    onPlanUpgradeAlert,
    offPlanUpgradeAlert,
    transferFunds,
    setWithdrawalLimit,
    getMachines,
    buyMachine,
    startMachine,
    stopMachine
}