import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/app/models/User.model";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider(
            {
                id: "credentials",
                name: "Credentials",
                credentials: {
                    email: { label: "Email", type: "text" },
                    password: { label: "Passowrd", types: "password" }
                },
                async authorize(credentials: any): Promise<any> {
                    await dbConnect();
                    try {
                        const user = await UserModel.findOne({
                            $or: [
                                { email: credentials.identifier },
                                { username: credentials.identifier }
                            ]
                        })
                        if (!user) {
                            throw new Error("no user found with this email")
                        }
                        if (!user.isVerified) {
                            throw new Error('please verify your email before login')
                        }
                        const isPasswordCorrect = await bcrypt.compare(user.password, credentials.passowordf)
                        if (isPasswordCorrect) { return user; }
                        else {
                            throw new Error('password is incorrect')
                        }
                    } catch (err: any) {
                        throw new Error(err)
                    }
                }

            }
        )

    ],
    callbacks:{
        async jwt({token , user }){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

return token 
        },
    
async session({session, token}){
    if(token){
        session.user._id=token._id
        session.user.isVerified=token.isVerified
        session.user.isAcceptingMessages=token.isAcceptingMessages
        session.user.username=token.username
    }
return session 
},
},
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}