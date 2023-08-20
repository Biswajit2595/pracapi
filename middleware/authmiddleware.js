const jwt=require("jsonwebtoken");
const { ListModel } = require("../model/blacklist");

const auth=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    try {
        const list=await ListModel.findOne({token})
        if(list){
            res.send({"msg":"Please Login again"})
        }else{
            const decode=jwt.verify(token,"masai")
            if(decode){
                req.body.userID=decode.userID
                req.body.user=decode.user
                next()
            }else{
                res.send({"msg":"Please Login Again"})
            }
        }
    } catch (error) {
        res.status(400).send({'error':error})
    }
}

module.exports={auth}