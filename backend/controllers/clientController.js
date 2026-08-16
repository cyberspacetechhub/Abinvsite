
const {
    getAllClients, createNewClient, updateClient, deleteClient, getClient,
    clientExists, verifyClient, unverifyClient, searchClients,
    onMaintenanceAlert, offMaintenanceAlert, onSecurityAlert, offSecurityAlert,
    onPlanUpgradeAlert, offPlanUpgradeAlert, transferFunds,
    setWithdrawalLimit, getMachines, buyMachine, startMachine, stopMachine
} = require('../services/clientService');
const { userExists } = require('../services/userService');

const getAllClientsHandler = async (req, res) => {
    const data = {
        page: req.query.page,
        limit: req.query.limit
    }
    const clients = await getAllClients(data);
    if(clients.error) return res.status(500).send(clients.error);
    res.status(200).json(clients);
};

const createNewClientHandler = async(req, res) => {
    // console.log(req.body);
    const {firstname, lastname, username, email,  password} = req.body;
    if(!firstname, !lastname, !username, !email, !password) return res.status(400).send('Missing required fields');
    const duplicate = await userExists(email);
    if(duplicate) return res.status(409).send('Username already exists');
    const data = req.body
    const result = await createNewClient(data);
    if (result.error) return res.status(500).send(result.error);
    res.status(201).json(result);
}

const updateClientHandler = async(req, res) => {
    // console.log(req.body);
    if(!req.body) return res.status(400).send('Missing required fields');

    const _id = req.body._id
    // console.log("_id:", _id)
    const result = await updateClient(_id, req.body);
    if (result.error) return res.status(500).send(result.error);
    // console.log("error:",result.error);

    res.status(200).json(result);
}

const deleteClientHandler = async(req, res) => {
    if(!req.params.id) return res.status(400).send('Id is required');

    const result = await deleteClient(req.params.id);
    if (result.error) return res.status(500).send(result.error);
    res.status(200).json(result);
}

const getClientHandler = async(req, res) => {
    if(!req.params.id) return res.status(400).send('Id is required');

    const result = await getClient(req.params.id);
    if (result.error) return res.status(500).send(result.error);
    res.status(200).json(result);
}

const handleVerifyClient = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await verifyClient(_id);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}
const handleUnverifyClient = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await unverifyClient(_id);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}
const handleSearchClients = async(req, res) => {
    const {search} = req.query;
    const result = await searchClients(search);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}

const handleOnMaintenanceAlert = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await onMaintenanceAlert(_id, req.body);
    // console.log(result);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}

const handleOffMaintenanceAlert = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await offMaintenanceAlert(_id);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}

const handleOnSecurityAlert = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await onSecurityAlert(_id, req.body);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}

const handleOffSecurityAlert = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await offSecurityAlert(_id);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}

const handleOnPlanUpgradeAlert = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await onPlanUpgradeAlert(_id, req.body);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}

const handleOffPlanUpgradeAlert = async(req, res) => {
    if(!req.params.id) return res.status(400).json({message: 'Id is required'});

    const _id = req.params.id
    const result = await offPlanUpgradeAlert(_id);
    if(result.error) return res.status(500).json(result);
    res.status(200).json(result);
}

const handleTransferFunds = async (req, res) => {
    const { id } = req.params
    const { from, to, amount } = req.body
    if (!from || !to || !amount) return res.status(400).json({ message: 'from, to and amount are required' })
    const result = await transferFunds(id, { from, to, amount })
    if (result.error) return res.status(400).json({ message: result.error })
    res.status(200).json(result)
}

const handleSetWithdrawalLimit = async (req, res) => {
    const { id } = req.params
    const { limit } = req.body
    if (limit === undefined) return res.status(400).json({ message: 'limit is required' })
    const result = await setWithdrawalLimit(id, limit)
    if (result.error) return res.status(400).json({ message: result.error })
    res.status(200).json(result)
}

const handleGetMachines = async (req, res) => {
    const { id } = req.params
    const result = await getMachines(id)
    if (result.error) return res.status(400).json({ message: result.error })
    res.status(200).json(result)
}

const handleBuyMachine = async (req, res) => {
    const { id } = req.params
    const { machineId } = req.body
    if (!machineId) return res.status(400).json({ message: 'machineId is required' })
    const result = await buyMachine(id, { machineId })
    if (result.error) return res.status(400).json({ message: result.error })
    res.status(200).json(result)
}

const handleStartMachine = async (req, res) => {
    const { id } = req.params
    const { index } = req.body
    if (index === undefined) return res.status(400).json({ message: 'index is required' })
    const result = await startMachine(id, { index })
    if (result.error) return res.status(400).json({ message: result.error })
    res.status(200).json(result)
}

const handleStopMachine = async (req, res) => {
    const { id } = req.params
    const { index } = req.body
    if (index === undefined) return res.status(400).json({ message: 'index is required' })
    const result = await stopMachine(id, { index })
    if (result.error) return res.status(400).json({ message: result.error })
    res.status(200).json(result)
}

module.exports = {
    getAllClientsHandler,
    createNewClientHandler,
    updateClientHandler,
    deleteClientHandler,
    getClientHandler,
    handleVerifyClient,
    handleUnverifyClient,
    handleSearchClients,
    handleOnMaintenanceAlert,
    handleOffMaintenanceAlert,
    handleOnSecurityAlert,
    handleOffSecurityAlert,
    handleOnPlanUpgradeAlert,
    handleOffPlanUpgradeAlert,
    handleTransferFunds,
    handleSetWithdrawalLimit,
    handleGetMachines,
    handleBuyMachine,
    handleStartMachine,
    handleStopMachine
}