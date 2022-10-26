const mongoose=require('mongoose')

const validator=require('validator')
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true
})



// const me=new User({
//     name:"    Krishna  " ,
//     password:"krishna",
//     email:"   KRISHNA@GMAIL.COM"
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })


// const task1=new Tasks({
//     description:"     complete socket.io concept",
    
// })

// task1.save().then(()=>{
//     console.log(task1)
// }).catch((error)=>{
//     console.log(error)
// })