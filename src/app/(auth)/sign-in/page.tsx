'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { toast } from "sonner"
import {getSession, signIn, useSession} from "next-auth/react"
import { signInSchema } from '@/schemas/signInSchema';
import { useEffect, useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(session)
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });
const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Refresh session and redirect
        await getSession();
        router.push('/dashboard'); // or wherever you want to redirect
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // const handleCredentialsSignIn = async (e: React.FormEvent, data: z.infer<typeof signInSchema>) => {
  //   // e.preventDefault()
  //   const result = await signIn('credentials', {
  //     redirect: false,
  //     identifier: data.identifier,
  //     password: data.password,
  //   });

  //   if (result?.error) {
  //     if (result.error === 'CredentialsSignin') {
  //       toast.error("Login failed", {
  //         description: 'Incorrect username or password'
  //       })
  //     } else {
  //       toast.error("Error", { description: result.error })
  //     }
  //   }
  //   else {
  //   await  getSession()
  //    router.push('/dashboard');
  //   }
     
   
  // };
  // useEffect( ()=>{
  //     if(session?.data?.user){
  //       console.log("session is available", session.data.user.email)
  //       redirect("/dashboard")
  //     }
  // },[session])
   const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { 
        callbackUrl: '/dashboard' // Where to redirect after successful sign-in
      });
    } catch (error) {
      setError('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-300 text-sm">
            Sign in to continue your secret conversations
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={handleCredentialsSignIn} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email / Username</FormLabel>
                  <Input 
                    {...field} 
                    className="bg-gray-900/40 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email or username"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <Input 
                    type="password" 
                    {...field} 
                    className="bg-gray-900/40 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md"
              type="submit"
            >
              Sign In
            </Button>
          </form>

          {/* Divider & Google Login */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>
          <button 
            className="w-full border border-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
          >
            <Image src="/google-icon.svg" alt="Google" className="w-5 h-5" width={5} height={5} />
            Log In with Google
          </button>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
