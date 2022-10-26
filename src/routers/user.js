const express=require('express')

const router=new express.Router()
const multer=require('multer')
const User=require("../models/user")
const auth=require('../middlewares/auth')
const sharp=require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

router.post('/users',async(req,res)=>{
    const me=new User(req.body)
    try{
        
        const token=await me.generateAuthToken()
        await me.save()
        sendWelcomeEmail(me.email,me.name)
        res.send({me,token})
    }
    catch(e){
        res.status(400).send(e)
    }
    // me.save().then(()=>{
    //     res.send(me)
    //     console.log(me)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})


router.get('/users/me',auth,async(req,res)=>{

    res.send(req.user)
    // User.find().then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.send(e)
    // })
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
            // ikkada first token ante tokens array lo unna each index lo unna document andulo token ane key untundi
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

// router.get('/users/:id',async(req,res)=>{
//     const _id=req.params.id
//     try{
//         const user=await User.findById(_id)
//         if(!user){
//             res.status(404).send()
//         }
//         else{
//             res.send(user)
//         }
//     }catch(e){
//         res.status(500).send(e)
//     }
    

    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
//})
const upload=multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error("file should be in image format"))
        }

        cb(undefined,true)
    }

})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    
    res.send()
})

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        
        const token=await user.generateAuthToken()
        
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
})

router.patch('/users/me',auth,async(req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','age','password']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({"Error":"invalid updates"})
    }
    try{
        
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        // user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        // if(!req.user){
        //     return res.status(404).send()
        // }
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    
    try{
        // const user=await User.findByIdAndDelete(req.params.id)
        
        // if(!user){
        //     return res.status(404).send()
        // }
        sendCancellationEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router
