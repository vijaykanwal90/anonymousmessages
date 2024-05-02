import React from 'react'
import { useParams,  useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import {useForm} from 'react-hook-form'
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username:string }>()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof verifySchema>>(
        {
          resolver: zodResolver(verifySchema),
          
          }
      )
      const onSubmit = async (data:z.infer<typeof verifySchema>)=>{
try {
   const response =  await axios.post(`/api/verify-code`,{username:params.username, 
        code:data.code
    })

    toast ({
        title:"Success",
        description:response.data.message
    })
    router.replace(`sign-in`)
} catch (error) {
    console.error("Error in signup of user", error)
    const axiosError = error as AxiosError<ApiResponse>;
    let errorMessage = axiosError.response?.data.message

    toast({
      title: 'Sign-up failed',
      description: errorMessage,
      variant: 'destructive'
    })
}
      }
  return (
    <div className ='flex justify-center items-center min-h-screen bg-greay-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className='text-4xl font-extrabold tracing-tight lg:text-5xl mb-6
                '>
                    Verify Your Account
                </h1>
                <p className='mb-4'>Enter the verification code sent to your email</p>
            </div>
            
        </div>
      
    </div>
  )
}

export default VerifyAccount
