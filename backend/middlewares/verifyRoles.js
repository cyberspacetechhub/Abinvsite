const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {

        const rolesArray = [...allowedRoles];
        // console.log('rolesArray:', rolesArray);
        const result =  rolesArray.some((role) => role === req.roles) ;
        // console.log('result:', result);
        // console.log(allowedRoles)
        // console.log(req.roles)
        if (!result) {
            return res.sendStatus(403); // Forbidden
        }

        next();
    };
};

module.exports = verifyRoles;
