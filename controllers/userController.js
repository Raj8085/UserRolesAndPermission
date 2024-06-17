const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const User = require("../models/userModel")
const {sendMail} = require("../helpers/mailer")
const mongoose = require("mongoose")
const Permission = require("../models/permissionModel")
const UserPermission = require("../models/userPermissionModel")
const createUser=async(req,res)=>{
    try {
        const errors = validationResult(req);

         if(!errors.isEmpty()){
            return res.status(400).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }

         const {name,email} = req.body;
         const isExits =  await User.findOne({email})
         if(isExits){
            return res.status(400).json({
                success : false,
                msg : 'Errors',
                errors : "Email already exits!"
            })
         }
         const password = randomstring.generate(6);
         const hashPassword = await bcrypt.hash(password,10);

         const obj = new User({
            name,
            email,
            password : hashPassword
         })

         if(req.body.role && req.body.role == 1){
            return res.status(400).json({
                success : false,
                msg : 'Errors',
                errors : "You can't create admin!"
            })
         } 
         else if(req.body.role){
            obj.role = req.body.role
         }

         const user = new User(obj);
         const userData = await user.save();

         //add permission to user if coming in request
         if(req.body.permissions != undefined && req.body.permissions.length > 0){
            const addPermission = req.body.permissions;

            const permissionArray = [];

           await Promise.all(addPermission.map(async(permission)=>{
                const permissionData = await Permission.findOne({_id : permission.id})

                permissionArray.push({
                    permission_name : permissionData.permission_name,
                    permission_value:permission.value
                })
            }));
           const userPermission =  new UserPermission({
                user_id : userData._id,
                permissions : permissionArray
            })
            await userPermission.save();
         }

         console.log(password)

         const content = `
         <p>Hii <b>`+userData.name+`,</b> Your account is created,below is your detail</p>
         <table style="border-style:none">
            <tr>
                <th>Name:-</th>
                <td>`+userData.name+`</td>
            </tr>
            <tr>
                <th>Email:-</th>
                <td>`+userData.email+`</td>
            </tr>
            <tr>
                <th>Password:-</th>
                <td>`+password+`</td>
            </tr>
         </table>
         `

         sendMail(userData.email,"Account created",content);

         return res.status(200).json({
            success : true,
            msg : 'User created successfully',
            data : userData
        })

    } catch (error) {
         return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}

const updateUsers=async(req,res)=>{
        try {
            const errors = validationResult(req);
    
             if(!errors.isEmpty()){
                return res.status(400).json({
                    success : false,
                    msg : 'Errors',
                    errors : errors.array()
                })
             }
    
             const {name,id} = req.body;
             const isExits =  await User.findOne({_id:id})
             if(!isExits){
                return res.status(400).json({
                    success : false,
                    msg : 'Errors',
                    errors : "User doesn't exits!"
                })
             }
             const updateObj = {
                name
             }
             if(req.body.role != undefined){
                updateObj.role = req.body.role
             }

            const updateData =  await User.findByIdAndUpdate({_id:id},{
                $set:updateObj,

             },{new:true})

             //Update user with permissions
             if(req.body.permissions != undefined && req.body.permissions.length > 0){
                const addPermission = req.body.permissions;
    
                const permissionArray = [];
    
               await Promise.all(addPermission.map(async(permission)=>{
                    const permissionData = await Permission.findOne({_id : permission.id})
    
                    permissionArray.push({
                        permission_name : permissionData.permission_name,
                        permission_value:permission.value
                    })
                }));
                await UserPermission.findOneAndUpdate(
                    {user_id : updateData._id},
                    {permissions : permissionArray},
                    {upsert:true, new:true, setDefaultsOnInsert:true}
                )
             }


             return res.status(400).json({
                success : false,
                msg : "User Updated successfully",
                data : updateData
            });

    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}



const deleteUser=async(req,res)=>{
    try {
        const errors = validationResult(req);

         if(!errors.isEmpty()){
            return res.status(400).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }

         const {id} = req.body;
         const isExits =  await User.findOne({_id:id})
         if(!isExits){
            return res.status(400).json({
                success : false,
                msg : 'Errors',
                errors : "User doesn't exits!"
            })
         }
           await User.findByIdAndDelete({_id:id})
         return res.status(400).json({
            success : false,
            msg : "User deleted successfully",
            
        });

} catch (error) {
    return res.status(400).json({
        success : false,
        msg :"User doesn't exits!"
    });
}
}



const getUsers=async(req,res)=>{
   try {

        // const users =  await User.find({
        //     _id:{
        //         $ne : req.user._id
        //     }
        //  })

        const users = await User.aggregate([
            {
                $match : {
                    _id:{
                        $ne : new mongoose.Types.ObjectId(req.user._id)
                    }
                }
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
            msg : "User Fetched successfully",
            data : users
        });


   } catch (error) {
    return res.status(400).json({
        success : false,
        msg : error.message
    });
   }
}




module.exports = {
    createUser,
    getUsers,
    updateUsers,
    deleteUser
}