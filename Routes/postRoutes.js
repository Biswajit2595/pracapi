const express=require("express");
const { auth } = require("../middleware/authmiddleware");
const { PostModel } = require("../model/postModel");

const postRouter=express.Router();

postRouter.post("/create",auth,async(req,res)=>{
    const post=req.body
    try {
        const newPost=new PostModel(post)
        await newPost.save()
        res.status(200).send({"msg":"new Post has been created",post:req.body})
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

postRouter.get("/",auth,async(req,res)=>{
    try {
        const notes=await PostModel.find({userID:req.body.userID})
        res.status(200).send(notes)
    } catch (error) {
        res.status(400).send({error})
    }
})

postRouter.get("/:id",auth,async(req,res)=>{
    const {id}=req.params
    try {
        const note=await PostModel.findOne({_id:id})
        res.status(200).send(note)
    } catch (error) {
        res.status(400).send({error})
    }
})

postRouter.put("/update/:id",auth,async(req,res)=>{
    const {id}=req.params
    const note=await PostModel.findOne({_id:id})
    try {
        if(req.body.userID!==note.userID){
            res.status({"msg":"You are not authorized to make changes in this post"})
        }else{
            const updatedPost=await PostModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).send({"msg":`Post with _id:${id} has been updated`})
        }
    } catch (error) {
        res.status(400).send({error})
    }
})

postRouter.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params
    const note=await PostModel.findOne({_id:id})
    try {
        if(req.body.userID!==note.userID){
            res.status({"msg":"You are not authorized to delete in this post"})
        }else{
            const updatedPost=await PostModel.findByIdAndDelete({_id:id})
            res.status(200).send({"msg":`Post with _id:${id} has been Deleted`})
        }
    } catch (error) {
        res.status(400).send({error})
    }
})












module.exports={postRouter}