const {check} = require("express-validator");


exports.permissionAddValidator = [
    check('permission_name',"Permission name is required").not().isEmpty()
]

exports.permissionDeleteValidator = [
    check('id',"id is required").not().isEmpty()
]
exports.permissionUpdateValidator = [
    check('id',"Id is required").not().isEmpty(),
    check('permission_name',"Permission name is required").not().isEmpty(),
]

exports.categoryAddValidator = [
    check('category_name',"Category name is required").not().isEmpty()
]

exports.categoryDeleteValidator = [
    check('id',"id is required").not().isEmpty()
]
exports.categoryUpdateValidator = [
    check('id',"Id is required").not().isEmpty(),
    check('category_name',"Category name is required").not().isEmpty(),
]

exports.postCreateValidator = [
    check('title',"title is required").not().isEmpty(),
    check('description',"description name is required").not().isEmpty(),
]
exports.postdeleteValidator = [
    check('id',"id is required").not().isEmpty()
]
exports.updatePostValidator = [
    check('id',"Id is required").not().isEmpty(),
    check('title',"title is required").not().isEmpty(),
    check('description',"description is required").not().isEmpty()
]

exports.storeRoleValidator = [
    check("role_name","Role_name is rquired").not().isEmpty(),
    check("value","Value is rquired").not().isEmpty()
]

exports.addRouterPermissionValidator = [
    check("router_endpoint","router_endpoint is rquired").not().isEmpty(),
    check("role"," role is rquired").not().isEmpty(),
    check("permission_id","permission_id is rquired").not().isEmpty(),

    check("permission","permission must be an array").isArray()
]

exports.getRouterPermissionValidator = [
    check("router_endpoint","router_endpoint is rquired").not().isEmpty(),
]