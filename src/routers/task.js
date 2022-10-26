const express=require('express')

const router=new express.Router()

const Task=require("../models/task")
const auth=require('../middlewares/auth')
router.delete('/tasks/:id',auth,async(req,res)=>{
    
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','isCompleted']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({"Error":"ivalid updates"})
    }
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        //const task=await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        // const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
       
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/tasks',auth,async(req,res)=>{
    //const task=new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
       await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.send(task)
    //     console.log(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})
// GET // task?isCompleted=true
// task?limit=2&skip=2
// task?sortBy=isCompleted:desc(here desc means first completed then not completed)
// asc =1 and desc =-1
router.get('/tasks',auth,async(req,res)=>{
    try{
        //const tasks=await Task.find()
        const match={}
        const sort={}
        if(req.query.isCompleted){
            match.isCompleted=req.query.isCompleted==='true'
        }
        if(req.query.sortBy){
            const parts=req.query.sortBy.split(':')
            sort[parts[0]]=parts[1]==="desc"?-1:1
        }
        
        const user=req.user
        await user.populate({
            path:"tasks",
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.find().then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        //const task=await Task.findById(_id)
        
        if(!task){
            res.status(404).send()
        }else{
            res.send(task)
        }
    }catch(e){
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //    res.status(500).send(e) 
    // })
})

module.exports=router