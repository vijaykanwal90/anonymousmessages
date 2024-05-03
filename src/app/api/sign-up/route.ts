import { dbConnect } from "@/lib/dbConnect";

import UserModel from "@/app/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect();
    try {
     const {username , email , password} =    await request.json();
        
   const existingUserVerifiedByUsername= await  UserModel.findOne({
        username,
        isVerified:true
     })
       if(existingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"username already taken"
        },{status:400})
       } 
      const existingUserByEmail = await UserModel.findOne({
        email
       })
       const verifyCode = Math.floor(10000 + Math.random()*9000).toString()
       if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
           return  Response.json({
                success:false,
                message:"user already exist with this username"
            },{status:400}
              
            )
        }
        else {
            const hashedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hashedPassword
            existingUserByEmail
            .verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000)
            await existingUserByEmail.save();
        }
       }
       else {
     const hashedPassword =    await bcrypt.hash(password,10)
     const expiryDate = new Date()
     expiryDate.setHours(expiryDate.getHours()+1)
    const newUser =  new UserModel({
        username,
        email,
        password:hashedPassword,
        verifyCode,
        verifyCodeExpiry:expiryDate,
        isVerified:false,
        isAcceptingMessages:true,
        messages:[]
     })
     await newUser.save();
       }
    //    send verification email
  const emailResponse =   await sendVerificationEmail(email,username,verifyCode)

  if(!emailResponse.success){
return Response.json({
    success:false,
    message:email.Response.message
},{status:500}
  
)

  }
  return Response.json({
      success:true,
      message:"user registered successfully please verify your email"    
    },{status:201})
    } catch (error) {
        console.error("error in registering user",error)
        return Response.json(
            {
                success:false,
                message:"error registering  user"
            },{
                status:500
            }
        )
    }
}