import uploadOnCloudinary from "../config/cloudinary.js"
import Conversation from "../models/conversation.model.js"
import message from "../models/message.model.js"

export const sendMessage=async (req,res)=>{
    try {
        let sender=req.userId
        let{reciver}=req.params
        let {message}=req.body

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        let conversation= await Conversation.findOne({
            participants:{$all:[sender,reciver]}
        })

        let newMessage = await message.create({
            sender,reciver,message,image
        })

        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender,reciver],
                message:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        return res.status(200).json(newMessage)
    } catch (error) {
        return res.status(500).json({message:`send Message error ${error}`})
    }
}


export const getMessages=async (req,res)=>{
    try {
        let sender=req.userId
        let {reciver}=req.params
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,reciver]}
        }).populate("messages")

        if(!conversation){
            return res.status(400).json({message:"conversation not found"})
        }

        return res.status(200).json(conversation?.messages)
    } catch (error) {
        return res.status(500).json({message:`get message error ${error}`})
    }
}