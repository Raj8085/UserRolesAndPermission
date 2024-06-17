const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authmiddleware");
const {categoryAddValidator,categoryDeleteValidator,categoryUpdateValidator,postCreateValidator,postdeleteValidator,updatePostValidator} = require("../helpers/adminValidator");
const categoryController = require('../controllers/categoryController') 
const postController = require("../controllers/postController")
const {createUserValidator,updateUserValidator,deleteUserValidator,postLikeUnlikeValidator,postLikeCount}  = require("../helpers/validator")
const {createUser,getUsers,updateUsers,deleteUser} = require("../controllers/userController")
const {postLike,postUnlike,countLike} = require("../controllers/likeControll")
const {checkPermission} = require("../middlewares/checkPermission")


//category routes


router.post('/add-category',auth,checkPermission,categoryAddValidator,categoryController.addcategory)
router.get('/get-categories',auth,checkPermission,categoryController.getcategory)
router.post('/delete-category',auth,checkPermission,categoryDeleteValidator,categoryController.deleteCategory)
router.post('/update-category',auth,checkPermission,categoryUpdateValidator,categoryController.updateCategory)
 
//Post routes

router.post("/create-post",auth,checkPermission,postCreateValidator,postController.createPost)
router.get("/get-post",auth,checkPermission,postController.getPost)
router.post("/delete-post",auth,checkPermission,postdeleteValidator,postController.deletePost)
router.post("/update-post",auth,checkPermission,updatePostValidator,postController.updatePost)

//User routes

router.post("/create-user",auth,checkPermission,createUserValidator,createUser)
router.get("/get-user",auth,checkPermission,getUsers)
router.post("/update-users",auth,checkPermission,updateUserValidator,updateUsers)
router.post("/delete-user",auth,checkPermission,deleteUserValidator,deleteUser)

//Like Unlike routes
router.post("/post-like",auth,checkPermission,postLikeUnlikeValidator,postLike)
router.post("/post-unlike",auth,checkPermission,postLikeUnlikeValidator,postUnlike)
router.post("/count-like",auth,checkPermission,postLikeCount,countLike)



module.exports = router;