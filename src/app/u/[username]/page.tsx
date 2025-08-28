'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// import { CardHeader, CardContent, Card } from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import * as z from 'zod';
import { ApiResponse ,ApiResponseSuggestion} from '@/types/ApiResponse';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

import {toast} from "sonner"


export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [separatedData, setSeparatedData] = useState<string[]>([]);

//  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');
 



  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });
     if(!response.data.isAcceptingMessages){
        
        toast.error('Error', {description:"User is not accepting messages"})
     }
     

      toast.message(response.data.message)
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
     
      toast.error('Error', {description:axiosError.response?.data.message})
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSuggestedMessages = async () => {
    try {
       setIsLoading(true)
      const response = await axios.post<ApiResponseSuggestion>('/api/suggest-message')
      console.log(response)
      const aiGeneratedText = response.data.data;
    
      // Check if aiGeneratedText is indeed a string before splitting
      if (typeof aiGeneratedText === 'string') {
        const separatedData = aiGeneratedText.split("||");
        console.log('Separated Data:', separatedData);  // Debugging log to see the result
        
        // Update state with the array of suggestions
        setSeparatedData(separatedData);

      } else {
        console.log('Expected a string but got:', typeof aiGeneratedText);
      }
      setIsLoading(false)

   
    
    } catch (error) {
      
      const axiosError = error as AxiosError<ApiResponse>;
      setIsLoading(false)
      
     
      toast.error('Error', {description:axiosError.response?.data.message})
    }
  }
 

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <button type="submit" disabled={isLoading || !messageContent} className='border-2 rounded-md bg-gray-800 text-white px-4 py-2'>
                Send It
              </button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 border-2 rounded-md bg-gray-800 text-white px-4 py-2"
            disabled={isLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        
      
        {separatedData.length > 0 && ( // Only render if there are suggestions
          <ul>
            {separatedData.map((message, index) => (
                 <Button
                 key={index}
                 variant="outline"
                 className="mb-2 transition-transform duration-200 hover:scale-105"
                 onClick={() => handleMessageClick(message)}
               >
                 {message}
               </Button>
              // <li key={index}>{message}</li>
            ))}
          </ul>
        )}
      </div>

      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button className='border-2 rounded-md bg-gray-800 text-white px-4 py-2'>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}


{/* <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              .map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card> */}


