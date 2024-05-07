import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {User} from "next-auth"
import mongoose from "mongoose";


export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    console.log(session)
    const user:User =  session?.user 
    if(!session || !session.user){
       return Response.json({
           success:false,
           message:"not authenticated"
       },{status:401})
   
    }
//    console.log(session)
    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}

        ])
        // if(!user || user.length === 0){
        //     return Response.json({
        //         success:false,
        //         message:"user not found"
        //     },{status:401})
    
        // }
       
        return Response.json({
            success:true,
            messages:user[0].messages
        },{status:200})
    } catch (error) {
        console.error('Unable to load any messages',error)
        return Response.json({
            success:false,
            message:"failed to get messages"
        },{status:500})
    }
}