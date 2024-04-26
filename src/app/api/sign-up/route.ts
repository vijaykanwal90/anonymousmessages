import { dbConnect}  from "@/app/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect();
    try {
     const {username , email , password} =    await request.json();

        
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