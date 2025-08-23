import { dbConnect } from "@/lib/dbConnect";
import UserModel  from "@/models/User.model";

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
//    const isCodeValid = user.verifyCode === code
//    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
  

await user.save()
return Response.json(
    {
        success:true,
        messge:"logged in"
     } , {status:200})
    }
    catch(error){
Response.json(
    {
        success:false,
        messge:"error while logging"
     } , {status:200})
    
    }}