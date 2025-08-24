"use client"

// import { MessageCard } from '@/components/MessageCard';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import type { Message } from "@/models/User.model"
import type { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { type AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import type { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import MessageCard from "@/components/MessageCard"

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      console.log(response.data)
      setValue("acceptMessages", response?.data?.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error("Error", { description: axiosError.response?.data.message })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true)
      setIsSwitchLoading(false)
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages")

        setMessages(response.data.messages || [])
        if (refresh) {
          toast.success("Success", { description: "Showing latest messages" })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>

        toast.error("Error", { description: axiosError.response?.data?.message })
      } finally {
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
    },
    [setIsLoading, setMessages],
  )

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return

    fetchMessages()

    fetchAcceptMessages()
  }, [session, setValue, fetchAcceptMessages, fetchMessages])

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      })
      setValue("acceptMessages", !acceptMessages)

      toast.message(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error("Error", { description: axiosError.response?.data.message })
    }
  }

  if (!session || !session.user) {
    return <div></div>
  }

  const { username } = session.user as User

  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  console.log(baseUrl)
  const profileUrl = `${baseUrl}/u/${username}`
  //  console.log(profileUrl)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)

    toast.success("URL Copied", { description: "Profile URL has been copied to clipboard" })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">User Dashboard</h1>
            <p className="text-gray-600">Manage your messages and profile settings</p>
          </div>

          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Copy Your Unique Link</h2>
                <p className="text-sm text-gray-600 mb-3">Share this link to receive anonymous messages</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={profileUrl}
                  disabled
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button onClick={copyToClipboard} className="sm:w-auto w-full border-2 bg-gray-800 text-white">
                  Copy Link
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Message Settings</h2>
                <p className="text-sm text-gray-600 mb-4">Control whether you want to receive new messages</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                     className={`
    data-[state=checked]:bg-green-600 
    data-[state=unchecked]:bg-red-600
  `}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Accept Messages:{" "}
                    <span className={acceptMessages ? "text-green-600" : "text-red-600"}>
                      {acceptMessages ? "On" : "Off"}
                    </span>
                  </span>
                </div>
                {isSwitchLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-800" />}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Messages</h2>
                  <p className="text-sm text-gray-600">
                    {messages.length > 0
                      ? `${messages.length} message${messages.length === 1 ? "" : "s"}`
                      : "No messages yet"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    fetchMessages(true)
                  }}
                  disabled={isLoading}
                  className="sm:w-auto w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Refresh Messages
                    </>
                  )}
                </Button>
              </div>

              {messages.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {messages.map((message, index) => (
                    <MessageCard key={message._id} message={message} onMessageDelete={handleDeleteMessage} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    Share your unique link to start receiving anonymous messages from others.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
