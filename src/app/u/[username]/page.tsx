"use client";
import React from 'react'
import { useParams , useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { messageSchema } from '@/schemas/messageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

const page = () => {

  const params = useParams <{username:string}>()
  const {toast}= useToast()
  const form = useForm<z.infer<typeof messageSchema>>(
    {
      resolver: zodResolver(messageSchema),
      
      }
  )
  const onSubmit = async(data:z.infer<typeof 
    messageSchema>)=>{
      try {
       const response =  await axios.post<ApiResponse>('/api/send-message',{
        username:params.username
       })
        // console.log(response)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to send message',
        variant: 'destructive',
      });
      }
    }
  
  return (
    <div>
      
      <h1>Public Profile Link</h1>
      <h2>Send anonymous messages to</h2>


      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Messages</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your message" {...field} />
              </FormControl>
           
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      </Form>
    </div>
  )
}

export default page
