import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from  "@/models/User.model";


export async function POST(request:Request){
    await dbConnect()

   const {username, content} =  await request.json()

   try {
   const user = await  UserModel.findOneAndUpdate({
        username
    })

    if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },{status:404})
    
    }

    // is user accepting messages
    if(!user.isAcceptingMessages){
        return Response.json({
            success:false,
            message:"user is not accepting messages"
        },{status:403})
    }
    const newMessage = {content, createdAt:new Date()}

    user.messages.push(newMessage as Message)
    await user.save();

    return Response.json({
        success:true,
        message:"message sent"
    },{status:200})

   } catch (error) {
    console.error("error sending message",error)
    return Response.json({
        success:false,
        message:"error sending message"
    },{status:500})
   }
}