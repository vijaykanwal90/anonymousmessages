"use client";
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { ApiResponse } from '@/types/ApiResponse'
import {signInSchema} from '@/schemas/signInSchema'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

const page = () => {
  const [username, setUsername] = useState('')
  const [password , setPassword] = useState('')
  const form = useForm<z.infer<typeof signInSchema>>(
    {
      resolver: zodResolver(signInSchema),
      defaultValues: {
        identifier: '',
        
        password: ''
      }
    }
  )
  const onSubmit = async (data:z.infer<typeof signInSchema>)=>{

  }
  return (
    <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
