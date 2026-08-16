const MiningMachine = require('../models/MiningMachine');
const Client = require('../models/Client');
const { createNotification } = require('./notificationService');

// ── Admin: catalog CRUD ──────────────────────────────────────────────────────

const createMachine = async (data) => {
    try {
        const existing = await MiningMachine.findOne({ machineId: data.machineId });
        if (existing) return { error: 'Machine ID already exists' };
        const machine = await MiningMachine.create(data);
        return machine;
    } catch (e) {
        return { error: e.message };
    }
};

const getMachines = async () => {
    try {
        const machines = await MiningMachine.find().sort({ price: 1 });
        return { machines };
    } catch (e) {
        return { error: e.message };
    }
};

const getActiveMachines = async () => {
    try {
        const machines = await MiningMachine.find({ isActive: true }).sort({ price: 1 });
        return { machines };
    } catch (e) {
        return { error: e.message };
    }
};

const updateMachine = async (id, data) => {
    try {
        const machine = await MiningMachine.findById(id);
        if (!machine) return { error: 'Machine not found' };
        const fields = ['name', 'hashrate', 'price', 'dailyRate', 'description', 'image', 'isActive'];
        fields.forEach(f => { if (data[f] !== undefined) machine[f] = data[f]; });
        return await machine.save();
    } catch (e) {
        return { error: e.message };
    }
};

const deleteMachine = async (id) => {
    try {
        const machine = await MiningMachine.findById(id);
        if (!machine) return { error: 'Machine not found' };
        await machine.deleteOne();
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
};

// ── Admin: user mining management ────────────────────────────────────────────

const adminCreditMining = async (userId, amount) => {
    try {
        const client = await Client.findById(userId);
        if (!client) return { error: 'Client not found' };
        client.miningBalance = parseFloat((client.miningBalance + parseFloat(amount)).toFixed(4));
        await client.save();
        await createNotification(userId, '⛏️ Mining Balance Credited', `$${amount} has been credited to your mining account.`, 'success');
        return { success: true, miningBalance: client.miningBalance };
    } catch (e) {
        return { error: e.message };
    }
};

const adminDeductMining = async (userId, amount) => {
    try {
        const client = await Client.findById(userId);
        if (!client) return { error: 'Client not found' };
        if (client.miningBalance < amount) return { error: 'Insufficient mining balance' };
        client.miningBalance = parseFloat((client.miningBalance - parseFloat(amount)).toFixed(4));
        await client.save();
        await createNotification(userId, '⛏️ Mining Balance Deducted', `$${amount} has been deducted from your mining account.`, 'info');
        return { success: true, miningBalance: client.miningBalance };
    } catch (e) {
        return { error: e.message };
    }
};

const adminForceStartMachine = async (userId, index) => {
    try {
        const client = await Client.findById(userId);
        if (!client) return { error: 'Client not found' };
        const machine = client.miningMachines[index];
        if (!machine) return { error: 'Machine not found' };
        machine.status = 'running';
        machine.startedAt = new Date();
        await client.save();
        await createNotification(userId, '⛏️ Mining Machine Started', `Your ${machine.name} has been started by admin.`, 'info');
        return { success: true, machines: client.miningMachines };
    } catch (e) {
        return { error: e.message };
    }
};

const adminForceStopMachine = async (userId, index) => {
    try {
        const client = await Client.findById(userId);
        if (!client) return { error: 'Client not found' };
        const machine = client.miningMachines[index];
        if (!machine) return { error: 'Machine not found' };
        if (machine.status === 'running') {
            const catalog = await MiningMachine.findOne({ machineId: machine.machineId });
            const dailyRate = catalog ? catalog.dailyRate : 0.5;
            const hoursRun = (Date.now() - new Date(machine.startedAt).getTime()) / (1000 * 60 * 60);
            const earned = parseFloat(((hoursRun / 24) * dailyRate).toFixed(4));
            machine.totalMined = parseFloat(((machine.totalMined || 0) + earned).toFixed(4));
            client.miningBalance = parseFloat((client.miningBalance + earned).toFixed(4));
        }
        machine.status = 'stopped';
        await client.save();
        await createNotification(userId, '⛏️ Mining Machine Stopped', `Your ${machine.name} has been stopped by admin.`, 'info');
        return { success: true, machines: client.miningMachines, miningBalance: client.miningBalance };
    } catch (e) {
        return { error: e.message };
    }
};

const adminRemoveUserMachine = async (userId, index) => {
    try {
        const client = await Client.findById(userId);
        if (!client) return { error: 'Client not found' };
        if (!client.miningMachines[index]) return { error: 'Machine not found' };
        client.miningMachines.splice(index, 1);
        await client.save();
        return { success: true, machines: client.miningMachines };
    } catch (e) {
        return { error: e.message };
    }
};

const getUserMiningOverview = async (userId) => {
    try {
        const client = await Client.findById(userId).select('miningBalance miningMachines firstname lastname email');
        if (!client) return { error: 'Client not found' };
        return { client };
    } catch (e) {
        return { error: e.message };
    }
};

module.exports = {
    createMachine,
    getMachines,
    getActiveMachines,
    updateMachine,
    deleteMachine,
    adminCreditMining,
    adminDeductMining,
    adminForceStartMachine,
    adminForceStopMachine,
    adminRemoveUserMachine,
    getUserMiningOverview
};
