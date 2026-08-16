const {
    createService, getAllServices, getServicesByUser,
    updateService, toggleService, resolveService,
    deleteService, getActiveServicesForUser
} = require('../services/serviceRequestService');

const handleCreateService = async (req, res) => {
    const { user, type, account } = req.body;
    if (!user || !type) return res.status(400).json({ message: 'user and type are required' });
    const result = await createService(req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(201).json(result);
};

const handleGetAllServices = async (req, res) => {
    const result = await getAllServices({ page: req.query.page, limit: req.query.limit });
    if (result.error) return res.status(500).json({ message: result.error });
    res.status(200).json(result);
};

const handleGetServicesByUser = async (req, res) => {
    const result = await getServicesByUser(req.params.userId);
    if (result.error) return res.status(500).json({ message: result.error });
    res.status(200).json(result);
};

const handleGetActiveServices = async (req, res) => {
    const result = await getActiveServicesForUser(req.params.userId);
    if (result.error) return res.status(500).json({ message: result.error });
    res.status(200).json(result);
};

const handleUpdateService = async (req, res) => {
    const result = await updateService(req.params.id, req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleToggleService = async (req, res) => {
    const { isActive } = req.body;
    if (isActive === undefined) return res.status(400).json({ message: 'isActive is required' });
    const result = await toggleService(req.params.id, isActive);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleResolveService = async (req, res) => {
    const result = await resolveService(req.params.id);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleDeleteService = async (req, res) => {
    const result = await deleteService(req.params.id);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

module.exports = {
    handleCreateService,
    handleGetAllServices,
    handleGetServicesByUser,
    handleGetActiveServices,
    handleUpdateService,
    handleToggleService,
    handleResolveService,
    handleDeleteService
};
