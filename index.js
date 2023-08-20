const express=require("express")
const cors=require("cors")
const { connection } = require("./db")
const { userRouter } = require("./Routes/userRoutes")
const { postRouter } = require("./Routes/postRoutes")
const app=express()
app.use(cors())
app.use(express.json())
app.use("/users",userRouter)
app.use("/posts",postRouter)

app.get("/",(req,res)=>{
    res.send("Welcome to the Home page")
})







app.listen(4000,async(req,res)=>{
    try {
        await connection
        console.log('Connected to Mongo Atlas')
        console.log('server is running at port 4000')
    } catch (error) {
        res.send({error})
    }
})