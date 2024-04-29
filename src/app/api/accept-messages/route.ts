import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User.model";
import {User} from "next-auth"

export async function POST(request:Request){

    await dbConnect()
     const session = await getServerSession(authOptions)
     const user:User =  session?.user 
     if(!session || !session.user){
        return Response.json({
            success:false,
            message:"not authenticated"
        },{status:401})
    
     }
    
     const userId = user._id;
    const {acceptMessages} =  await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {
                isAcceptingMessages:acceptMessages
            },
            {new:true}
        )
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"failed to update user status to get messages"
            },{status:401})
        }
        
            return Response.json({
                success:true,
                message:"message acceptance status updates",
                updatedUser
            },{status:200})
        
    } catch (error) {
        console.error("failed to update user status to get messages")
        return Response.json({
            success:false,
            message:"failed to update user status to get messages"
        },{status:500})
    }

}

export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"not authenticated"
        },{status:401})
    }
    const userId = user._id

 try {
      const foundUser = await UserModel.findById(userId)
   
      if(!foundUser){
       return Response.json({
           success:false,
           message:"failed to found the user"
       },{status:404})
   }
   return Response.json({
       success:true,
       message:"user found",
       isAcceptingMessages:foundUser.isAcceptingMessages
   },{status:200})
 } catch (error) {
    console.error("failed to get user status to get messages")
    return Response.json({
        success:false,
        message:"error in getting accepting messages status"
    },{status:500})
 }
}