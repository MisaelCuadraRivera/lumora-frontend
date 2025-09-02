"use client"

import type React from "react"

import { useState } from "react"
import { Send, Plus, Smile, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  channelName: string
  onSendMessage: (content: string) => void
}

export function ChatInput({ channelName, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="p-4 border-t border-slate-800">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2">
          <Button type="button" variant="ghost" size="sm" className="h-10 w-10 p-0 text-slate-400 hover:text-white">
            <Plus className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enviar mensaje a #${channelName}`}
              className="min-h-[44px] max-h-32 resize-none bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 pr-20"
              rows={1}
            />

            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                <Smile className="w-4 h-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                <Gift className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-10 bg-cyan-600 hover:bg-cyan-700 text-white"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
