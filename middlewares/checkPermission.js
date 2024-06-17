const helper = require("../helpers/helper")
const checkPermission = async(req,res,next) => {
    try {
        if(req.user.role != 1){ //if user not admin then this condition will run
            
            const routerPermission = await helper.getRouterPermission(req.path,req.user.role)
            const userPermissions = await helper.getUserPermissions(req.user._id)
            if(!routerPermission || userPermissions.permissions.permissions == undefined){
                return res.status(400).json({
                    success : false,
                    msg : "You haven't permission to access this route!"
                })
            }
            const permission_name = routerPermission.permission_id.permission_name;
            const permission_value = routerPermission.permission;

            const hashPermission = userPermissions.permissions.permissions.some(permission => 
                permission.permission_name == permission_name && 
                permission.permission_value.some(value => permission_value.includes(value))
            )
            if(!hashPermission){
                return res.status(400).json({
                    success : false,
                    msg : "You haven't permission to access this route!"
                })
            }
        }
        return next()
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : "Something went wrong"
        })
    }
}

module.exports = {
    checkPermission
}