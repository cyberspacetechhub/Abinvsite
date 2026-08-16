
const {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmin,
    adminExists
} = require('../services/adminService')
const { userExists } = require('../services/userService');
const handleGetAllAdmins = async (req, res) => {
    const data = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
    }
    const result = await getAllAdmins(data)
    if(result.error) return res.status(500).send(result.error)
    return result
}

const handleCreateAdmin = async (req, res) => {
    const {firstname, lastname, username, email, phone, password} = req.body
    if(!firstname || !lastname || !username || !email || !phone || !password) return res.status(400).send('Missing required fields')
    const duplicate = await userExists(email)
    if(duplicate) return res.status(409).send('Admin already exists')
    const data = req.body
    const result = await createAdmin(data)
    if(result.error) return res.status(500).send(result.error)
    res.status(201).json(result)
}

const handleAdminSignup = async (req, res) => {
    const {firstname, lastname, email, phone, password} = req.body
    if(!firstname || !lastname || !email || !phone || !password) {
        return res.status(400).json({message: 'All fields are required'})
    }
    const duplicate = await userExists(email)
    if(duplicate) return res.status(409).json({message: 'Email already exists'})
    
    const adminData = {
        firstname,
        lastname,
        username: email,
        email,
        phone,
        password
    }
    const result = await createAdmin(adminData)
    if(result.error) return res.status(500).json({message: result.error})
    res.status(201).json({message: 'Admin account created successfully', admin: result})
}

const handleUpdateAdmin = async (req, res) => {
    if(!req.body) return res.status(400).send('Missing required fields')
    const _id = req.body.id
    const result = await updateAdmin(_id, req.body)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

const handleDeleteAdmin = async (req, res) => {
    if(!req.params.id) return res.status(400).send('Id is required')
    
    const _id = req.params.id
    const result = await deleteAdmin(_id)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

const handleGetAdmin = async (req, res) => {
    if(!req.params.id) return res.status(400).send('Id is required')

    const _id = req.params.id
    const result = await getAdmin(_id)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

module.exports = {
    handleGetAllAdmins,
    handleCreateAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleGetAdmin,
    handleAdminSignup
}