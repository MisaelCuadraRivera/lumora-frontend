import { ChatInterface } from "@/components/chat/chat-interface"

interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  return (
    <div className="h-screen">
      <ChatInterface spaceId={params.id} />
    </div>
  )
}
