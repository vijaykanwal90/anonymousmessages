import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/User.model';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email/Username and password are required');
          }

          const user = await UserModel.findOne({
            $or: [{ email: credentials.email }, { username: credentials.email }],
          });

          if (!user) {
            throw new Error('No user found with this email/username');
          }

          // Check if user signed up with Google
          if (user.provider === 'google' && !user.password) {
            throw new Error('Please sign in with Google');
          }

          if (!user.password) {
            throw new Error('Password not set for this account');
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error('Incorrect password');
          }

          return {
            _id: user._id?.toString() as string,
            email: user.email,
            username: user.username,
            image: user.image,
          };
        } catch (err: any) {
          throw new Error(err.message || 'Authentication failed');
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await dbConnect();
        
        try {
          let existingUser = await UserModel.findOne({ 
            $or: [
              { email: user.email },
              { googleId: account.providerAccountId }
            ]
          });

          if (!existingUser) {
            // Create new user for Google sign-in
            existingUser = await UserModel.create({
              email: user.email,
              username: user.name?.replace(/\s+/g, '').toLowerCase() || `user_${Date.now()}`,
              googleId: account.providerAccountId,
              image: user.image,
              provider: 'google',
              isAcceptingMessages: true,
            });
          } else if (!existingUser.googleId) {
            // Link Google account to existing credentials user
            existingUser.googleId = account.providerAccountId;
            existingUser.isAcceptingMessages = true,
            existingUser.image = user?.image ?? undefined;
            await existingUser.save();
          }

          return true;
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return false;
        }
      }
      
      return true; // Allow credentials sign-in
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'google' || user) {
        await dbConnect();
        
        try {
          let dbUser;
          
          if (account?.provider === 'google') {
            dbUser = await UserModel.findOne({ 
              $or: [
                { email: token.email },
                { googleId: account.providerAccountId }
              ]
            });
          } else if (user) {
            // For credentials login
            dbUser = await UserModel.findById((user as any)._id);
          }

          if (dbUser) {
            token._id = dbUser._id?.toString() ?? "";

            token.username = dbUser.username;
            token.email = dbUser.email;
            token.image = dbUser.image;
          }
        } catch (error) {
          console.error('Error in JWT callback:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === 'development',
};