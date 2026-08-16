const {
    createMachine, getMachines, getActiveMachines, updateMachine, deleteMachine,
    adminCreditMining, adminDeductMining,
    adminForceStartMachine, adminForceStopMachine,
    adminRemoveUserMachine, getUserMiningOverview
} = require('../services/miningMachineService');

// ── Admin: catalog ────────────────────────────────────────────────────────────

const handleCreateMachine = async (req, res) => {
    const { machineId, name, hashrate, price, dailyRate } = req.body;
    if (!machineId || !name || !hashrate || !price || !dailyRate)
        return res.status(400).json({ message: 'machineId, name, hashrate, price and dailyRate are required' });
    const result = await createMachine(req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(201).json(result);
};

const handleGetMachines = async (req, res) => {
    const result = await getMachines();
    if (result.error) return res.status(500).json({ message: result.error });
    res.status(200).json(result);
};

const handleGetActiveMachines = async (req, res) => {
    const result = await getActiveMachines();
    if (result.error) return res.status(500).json({ message: result.error });
    res.status(200).json(result);
};

const handleUpdateMachine = async (req, res) => {
    const { id } = req.params;
    const result = await updateMachine(id, req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleDeleteMachine = async (req, res) => {
    const { id } = req.params;
    const result = await deleteMachine(id);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

// ── Admin: user mining management ─────────────────────────────────────────────

const handleGetUserMiningOverview = async (req, res) => {
    const { userId } = req.params;
    const result = await getUserMiningOverview(userId);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleAdminCreditMining = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'amount is required' });
    const result = await adminCreditMining(userId, amount);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleAdminDeductMining = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'amount is required' });
    const result = await adminDeductMining(userId, amount);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleAdminForceStart = async (req, res) => {
    const { userId } = req.params;
    const { index } = req.body;
    if (index === undefined) return res.status(400).json({ message: 'index is required' });
    const result = await adminForceStartMachine(userId, index);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleAdminForceStop = async (req, res) => {
    const { userId } = req.params;
    const { index } = req.body;
    if (index === undefined) return res.status(400).json({ message: 'index is required' });
    const result = await adminForceStopMachine(userId, index);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleAdminRemoveUserMachine = async (req, res) => {
    const { userId } = req.params;
    const { index } = req.body;
    if (index === undefined) return res.status(400).json({ message: 'index is required' });
    const result = await adminRemoveUserMachine(userId, index);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

module.exports = {
    handleCreateMachine,
    handleGetMachines,
    handleGetActiveMachines,
    handleUpdateMachine,
    handleDeleteMachine,
    handleGetUserMiningOverview,
    handleAdminCreditMining,
    handleAdminDeductMining,
    handleAdminForceStart,
    handleAdminForceStop,
    handleAdminRemoveUserMachine
};
