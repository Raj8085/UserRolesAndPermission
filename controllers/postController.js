const {validationResult} = require('express-validator')
const Post = require("../models/postModel")
const createPost=async(req,res)=>{
    try {
        const errors = validationResult(req);

         if(!errors.isEmpty()){
            return res.status(200).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }
         const {title,description} = req.body;
         var obj = {
            title,
            description
         }
         if(req.body.categories){
            obj.categories = req.body.categories
         }
         const post = new Post(obj);
        const postdata =  await post.save();
        const postFullData = await Post.findOne({_id:postdata._id}).populate('categories'); 
        return res.status(200).json({
            success : true,
            msg : "Post created successfully",
            data : postFullData
        });

    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}
const getPost=async(req,res)=>{
    try {

        const post = await Post.find({}).populate('categories'); 
           return res.status(200).json({
               success : true,
               msg : "Post fetched successfully",
               data :post
           })
     
           
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : error.message
        });
    }
}

const deletePost=async(req,res)=>{
    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
           return res.status(200).json({
               success : false,
               msg : 'Errors',
               errors : errors.array()
           })
        }
     
        const {id} = req.body;
        const isEmpty = await Post.findOne({_id:id});
        if(!isEmpty){
            return res.status(400).json({
                success : false,
                msg : "Post doesn't exits"
            });
        }
        const deleteData = await Post.findByIdAndDelete({_id:id});
        return res.status(200).json({
            success : true,
            msg : "Post deleted successfully",
            data : deleteData
        });
           
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : "Post doesn't exits"
        });
    }
}

const updatePost=async(req,res)=>{
    try {
        const errors = validationResult(req);

         if(!errors.isEmpty()){
            return res.status(200).json({
                success : false,
                msg : 'Errors',
                errors : errors.array()
            })
         }
         const {id,title,description} = req.body;
         const isEmpty = await Post.findOne({_id:id});
         if(!isEmpty){
             return res.status(400).json({
                 success : false,
                 msg : "Post doesn't exits"
             });
         }
         var updateObj={
            title,
            description
         }
         if(req.body.categories){
            updateObj.categories = req.body.categories;
         }
          await Post.findByIdAndUpdate({_id:id},{
            $set:updateObj
         })
         return res.status(400).json({
            success : true,
            msg : "Post updated successfully",
            data :  updateObj
        });
    } catch (error) {
        return res.status(400).json({
            success : false,
            msg : "Post doesn't exits"
        });
    }
}

module.exports = {
    createPost,
    getPost,
    deletePost,
    updatePost
}