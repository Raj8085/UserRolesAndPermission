const express = require("express");
const router = express();
const auth = require("../middlewares/authmiddleware");
const permissionController = require("../controllers/admin/permissionController")
const {permissionAddValidator,permissionDeleteValidator,permissionUpdateValidator,storeRoleValidator,addRouterPermissionValidator,getRouterPermissionValidator} = require("../helpers/adminValidator");
const {onlyAdminAccess} = require("../middlewares/adminMiddleware")
const {addUpdatePermission,getRouterPermission} = require("../controllers/admin/routerController")
const {storeRole,getRole} = require("../controllers/admin/roleControllers");
//Permission routed
router.post("/add-permission",auth,onlyAdminAccess,permissionAddValidator,permissionController.addPermission);
router.get("/get-permissions",auth,onlyAdminAccess,permissionController.getPermission);
router.post("/delete-permissions",auth,onlyAdminAccess,permissionDeleteValidator,permissionController.deletePermission);
router.post("/update-permissions",auth,onlyAdminAccess,permissionUpdateValidator,permissionController.updatePermission);


//role routes
router.post("/store-role",auth,onlyAdminAccess,storeRoleValidator,storeRole)
router.get("/get-roles",auth,onlyAdminAccess,getRole)
// router.get("/all-routes",auth,onlyAdminAccess,getAllRoutes)

//router permission route

router.post("/add-router-permission",auth,onlyAdminAccess,addRouterPermissionValidator,addUpdatePermission)
router.post("/get-router-permissions",auth,onlyAdminAccess,getRouterPermissionValidator,getRouterPermission)


module.exports = router;

 