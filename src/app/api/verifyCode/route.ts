import { dbConnect } from "@/lib/dbConnect";
import UserModel
 from "@/app/models/User.model";

export async function POST(request: Request){
await  dbConnect()
try {
    

    const {username , code} = await request.json()

   const decodedUsername =  decodeURIComponent(username)
   const user = await UserModel.findOne({username:decodedUsername})
   if(!user){
    return Response.json(
        {
            success:false,
            messge:"user not found"
         } , {status:500})
        
    
   }
   const isCodeValid = user.verifyCode === code
   const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
   if(isCodeValid && isCodeNotExpired){
user.isVerified = true
await user.save()
return Response.json(
    {
        success:true,
        messge:"account verified"
     } , {status:200})
   }
   else if(!isCodeNotExpired){
   return  Response.json(
        {
            success:false,
            messge:"verification code expired , please sign again to get a new code"
         } , {status:500})
   }
   else {
   return  Response.json(
        {
            success:false,
            messge:"incorrect verification code "
         } , {status:400})
   }
} catch (error) {
    console.error("error verifying user",error)
    return Response.json(
        {
            success:false,
            messge:"error checking username"
         } , {status:500})

}
}