"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Message } from "@/models/User.model"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface MessageCardProps {
  message: Message
  onMessageDelete: (messageId: string) => void
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      onMessageDelete(message._id)
      toast.success("Message deleted successfully")
    } catch (error) {
      toast.error("Failed to delete message")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="group relative w-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {new Date(message.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
          >
            <Trash2 className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`} />
            <span className="sr-only">Delete message</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed break-words">
          {message.content}
        </p>
      </CardContent>
    </Card>
  )
}
