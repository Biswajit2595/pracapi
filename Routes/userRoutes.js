const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { UserModel } = require("../model/userModel")
const { auth } = require("../middleware/authmiddleware")
const { ListModel } = require("../model/blacklist")
const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {email,pass}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(user){
            res.send({"msg":"User is already a registered User"})
        }else{
            bcrypt.hash(pass,4,async(err,hash)=>{
                if(err){
                    res.status(400).send({"err":err})
                }else{
                    const newUser=new UserModel({...req.body,pass:hash})
                    await newUser.save()
                    res.status(200).send({"msg":"New user added"})
                }
            })
        }
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(!user){
            res.send({"msg":"User Does not exist"})
        }else{
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user._id,user:user.username},"masai")
                    res.status(200).send({"msg":`${user.username} has succesfully logged id`,token})
                }else{
                    res.status(400).send({"error":err})
                }
            })
        }
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

userRouter.get("/logout",auth,async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    try {
        const list=new ListModel({token})
        await list.save()
        res.send({"msg":"User have succesfully logged out"})
    } catch (error) {
        res.status(400).send({"error":error})
    }
})



module.exports={userRouter}
