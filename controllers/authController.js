const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Permission = require("../models/permissionModel")
const UserPermission = require("../models/userPermissionModel")
const helper = require("../helpers/helper")
const registerUser = async(req,res) => {
    try {
         const errors = validationResult(req);

         if(!errors.isEmpty()){
            return res.status(200).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }
        
         const {name,email,password} = req.body;
         const isEmail = await User.findOne({email});
         if(isEmail){
            return res.status(200).json({
                success:false,
                msg : "Email already exit!"
            })
         }
         const hashPassword = await bcrypt.hash(password,10);
         const user = new User({
            name,
            email,
            password:hashPassword
         })
         const userData = await user.save();

         //assign default permissions

         const defaultpermission = await Permission.find({
            is_default : 1
         })

         if(defaultpermission.length > 0){
            const permissionArray = [];
            defaultpermission.forEach(permission=>{
                permissionArray.push({
                     permission_name:permission.permission_name,
                     permission_value:[0,1,2,3]
                })
            })
            const userpermission = new UserPermission({
                user_id : userData._id,
                permissions : permissionArray
            })
            await userpermission.save()
         }  
        


         return res.status(200).json({
            success : true,
            msg : "User register successfully",
            data : userData
         })
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}
const generateAccessToken = async(user)=>{
    const token = jwt.sign(user,process.env.ACCESS_SECRET_TOKEN,{expiresIn:"2h"});

    return token;
}
 

const loginUser=async(req,res)=>{
    try {
        const errors = validationResult(req);

         if(!errors.isEmpty()){
            return res.status(200).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }
         const {email,password} = req.body;
        const userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({
                success : false,
                msg : "Email and Password is incorrect!"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password,userData.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                msg : "Email and Password is incorrect!"
            });
        }
       const accessToken =  await generateAccessToken({user : userData});

       //Get user data with all permissions

       const result = await User.aggregate([
        {
            $match : {email : userData.email}
        },
        {
            $lookup:{
                from : "userpermissions",
                localField : "_id",
                foreignField : "user_id",
                as : "permissions"
            }
        },{
            $project:{
                _id : 0,
                name : 1,
                email : 1,
                role : 1,
                permissions : {
                    $cond:{
                        if:{ $isArray : "$permissions" },
                        then : {$arrayElemAt : ["$permissions",0]},
                        else : null
                    }
                }
            }
        },{
            $addFields:{
                "permissions" : {
                    "permissions" : "$permissions.permissions"
                }
            }
        }
       ])
        return res.status(200).json({
            success : true,
            msg : "Login successfully",
            accessToken : accessToken,
            tokenType : "Bearer",
            data : result
        });
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}

const getProfile= async(req,res)=>{
    try {
        const user_id = req.user._id;
        const userData = await User.findOne({_id : user_id});
        return res.status(200).json({
            success : true,
            msg : "Profile data",
            data : userData
        });
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}
const getUserPermission=async(req,res)=>{
    try {
        const user_id = req.user._id;
       const userPermission = await helper.getUserPermissions(user_id);
        return res.status(200).json({
            success : true,
            msg : "User Permission",
            data : userPermission
        });
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getUserPermission
     
}