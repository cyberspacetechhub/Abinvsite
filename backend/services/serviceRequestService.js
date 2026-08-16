const ServiceRequest = require('../models/ServiceRequest');
const { createNotification } = require('./notificationService');
const { sendServiceRequestEmail } = require('./emailService');
const User = require('../models/User');

const _notify = async (service, user) => {
    const accountLabel = { trading: 'Trading Account', mining: 'Mining Account', general: 'All Accounts' }[service.account] || service.account;
    await createNotification(
        user._id,
        `⚠️ Service Required: ${service.type}`,
        `A service request "${service.type}" has been activated on your ${accountLabel}. ${service.message || ''}${
            service.requiresPayment ? ` Payment of $${service.amountRequired} required.` : ''
        }`,
        'warning'
    );
    const dm = service.depositMethod;
    await sendServiceRequestEmail(
        user.email,
        user.firstname || user.username,
        service.type,
        service.account,
        service.message,
        service.requiresPayment,
        service.amountRequired,
        dm?.name,
        dm?.value
    );
};

// ── Admin ─────────────────────────────────────────────────────────────────────

const createService = async (data) => {
    try {
        const service = await ServiceRequest.create({
            user: data.user,
            type: data.type,
            account: data.account || 'general',
            message: data.message,
            isActive: data.isActive || false,
            requiresPayment: data.requiresPayment || false,
            amountRequired: data.amountRequired || 0,
            depositMethod: data.depositMethod || undefined,
            status: 'pending_payment'
        });

        if (service.isActive) {
            const populated = await ServiceRequest.findById(service._id).populate('depositMethod', 'name value');
            const user = await User.findById(data.user);
            if (user) await _notify(populated, user);
        }

        return service;
    } catch (e) {
        return { error: e.message };
    }
};

const getAllServices = async ({ page = 1, limit = 20 } = {}) => {
    try {
        const skip = (page - 1) * limit;
        const services = await ServiceRequest.find()
            .populate('user', 'firstname lastname email username')
            .populate('depositMethod', 'name value')
            .sort({ createdAt: -1 })
            .skip(skip).limit(limit);
        const count = await ServiceRequest.countDocuments();
        return { services, page, totalPage: Math.ceil(count / limit) };
    } catch (e) {
        return { error: e.message };
    }
};

const getServicesByUser = async (userId) => {
    try {
        const services = await ServiceRequest.find({ user: userId })
            .populate('depositMethod', 'name value')
            .sort({ createdAt: -1 });
        return { services };
    } catch (e) {
        return { error: e.message };
    }
};

const updateService = async (id, data) => {
    try {
        const service = await ServiceRequest.findById(id);
        if (!service) return { error: 'Service not found' };
        const fields = ['type', 'account', 'message', 'requiresPayment', 'amountRequired', 'depositMethod'];
        fields.forEach(f => { if (data[f] !== undefined) service[f] = data[f]; });
        return await service.save();
    } catch (e) {
        return { error: e.message };
    }
};

const toggleService = async (id, isActive) => {
    try {
        const service = await ServiceRequest.findById(id).populate('user').populate('depositMethod', 'name value');
        if (!service) return { error: 'Service not found' };
        service.isActive = isActive;
        if (isActive) {
            service.status = 'pending_payment';
            await service.save();
            await _notify(service, service.user);
        } else {
            await service.save();
        }
        return service;
    } catch (e) {
        return { error: e.message };
    }
};

const resolveService = async (id) => {
    try {
        const service = await ServiceRequest.findById(id).populate('user');
        if (!service) return { error: 'Service not found' };
        service.isActive = false;
        service.status = 'resolved';
        await service.save();
        await createNotification(
            service.user._id,
            '✅ Service Resolved',
            `Your service request "${service.type}" has been resolved. Your account activities have resumed.`,
            'success'
        );
        return service;
    } catch (e) {
        return { error: e.message };
    }
};

const deleteService = async (id) => {
    try {
        const service = await ServiceRequest.findById(id);
        if (!service) return { error: 'Service not found' };
        await service.deleteOne();
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
};

// ── Client: check if blocked ──────────────────────────────────────────────────

const getActiveServicesForUser = async (userId) => {
    try {
        const services = await ServiceRequest.find({ user: userId, isActive: true })
            .populate('depositMethod', 'name value');
        return { services };
    } catch (e) {
        return { error: e.message };
    }
};

module.exports = {
    createService,
    getAllServices,
    getServicesByUser,
    updateService,
    toggleService,
    resolveService,
    deleteService,
    getActiveServicesForUser
};
