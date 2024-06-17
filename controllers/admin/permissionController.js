const Permission = require("../../models/permissionModel")
const { validationResult } = require("express-validator");

const addPermission = async(req,res)=>{
    try {
        const errors =  validationResult(req);

         if(!errors.isEmpty()){
            return res.status(200).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }

         const {permission_name} = req.body;
         const isExits = await Permission.findOne({
            permission_name:{
                    $regex :  permission_name,
                    $options : "i"
            }
        });
         if(isExits){
            return res.status(200).json({
                success : false,
                msg : "Permission Name already exits!"
            });
         
        }
        var obj = {
            permission_name
        }

        if(req.body.default){
            obj.is_default = parseInt(req.body.default);
        }

         const permission = new Permission(obj);
         const newPermission =  await permission.save();
         return res.status(200).json({
            success : true,
            msg : "Permission added successfully",
            data : newPermission
        });


    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}

const getPermission=async(req,res)=>{
    try {
        const permission = await Permission.find({});
        return res.status(200).json({
            success : true,
            msg : "Permission fetched successfully!",
            data : permission
        });
        
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}

const deletePermission=async(req,res)=>{
    try {
        const errors =  validationResult(req);

        if(!errors.isEmpty()){
           return res.status(200).json({
               success : false,
               msg : 'Errors',
               errors : errors.array()
           })
        }

        const {id} = req.body;
        await Permission.findByIdAndDelete({_id : id});
        return res.status(200).json({
            success : true,
            msg : "Permission Deleted successfully!"
        })
        
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}


const updatePermission = async(req,res)=>{
    try {
        const errors =  validationResult(req);

         if(!errors.isEmpty()){
            return res.status(200).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }

         const {id,permission_name} = req.body;
         
         const isExits = await Permission.findOne({
            _id:id
        });
         if(!isExits){
            return res.status(400).json({
                success : false,
                msg : "Permission Id not found!"
            });
        }


        const isNameAssigned = await Permission.findOne({
            _id:{ $ne:id },
            permission_name:{
                $regex :  permission_name,
                $options : "i"
        }
        });
        if(isNameAssigned){
           return res.status(400).json({
               success : false,
               msg : "Permission name already assign to another permission!"
           });
       }

        var updatePermission = {
            permission_name
        }

        if(req.body.default != null){
            updatePermission.is_default = parseInt(req.body.default);
        }
 
       const updatedPermission =  await Permission.findByIdAndUpdate({_id:id},{
            $set : updatePermission
        },{new:true});


         return res.status(200).json({
            success : true,
            msg : "Permission update successfully",
            data : updatedPermission
        });


    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : "Id is not found!"
        });
    }
}

module.exports = {
    addPermission,
    getPermission,
    deletePermission,
    updatePermission
}