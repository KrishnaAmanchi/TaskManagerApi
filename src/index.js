const express=require('express')
require("./db/mongoose")
const User=require("./models/user")
const Task=require("./models/task")
const app=express()
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const port=process.env.PORT
const bcrypt=require('bcryptjs')
const multer=require('multer')
// app.use((req,res,next)=>{
//     res.status(503).send("This site is under maintenance")
// })
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// const hashfun=async(password)=>{
//     const hashCode=await bcrypt.hash(password,8)
//     const isSame=await bcrypt.compare(password,hashCode)
//     console.log(hashCode)
//     console.log(isSame)
// }
// hashfun("Krishna@2002")
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){ // regular expression should be kept between // i.e /regx/
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             cb(new Error('file should be a word document'))
//         }
//         cb(undefined,true)
//     }
// })
// here upload.single is a middleware if it works then remaining work will be done if it is not working then the error will be thrown 
// like file should be this which is shown like above.
// now to handle these express errors we have to keep another function inside the route which is shown below..
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })
app.listen(port,()=>{
    console.log("server is running at port number ",port)
})
// eppudaina async function () ee order lo undali
//const main=async()=>{
    // const task=await Task.findById("6350da39088c8a7bfa9e3002")
    // await task.populate("owner")
    // console.log(task.owner)

    // const user= await User.findById("6350da1c088c8a7bfa9e2ff8")
    // await user.populate("tasks")
    //  console.log(user.tasks)
//}

//main()

// npm i ----     --save-dev  if we have given like this then it will be installed only for development purpose 
// next time when anyone downloaded nodemodules this will not be loaded i think..

