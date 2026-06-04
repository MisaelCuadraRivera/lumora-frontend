import { ChatInterface } from "@/components/chat/chat-interface"

interface ChatPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ChatPage(props: ChatPageProps) {
  const params = await props.params;
  return (
    <div className="h-screen">
      <ChatInterface spaceId={params.id} />
    </div>
  )
}
