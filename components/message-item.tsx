import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface MessageItemProps {
  message: {
    role: "ai" | "user"
    content: string
    timestamp: Date
  }
  isSequential: boolean
}

export default function MessageItem({ message, isSequential }: MessageItemProps) {
  const isAi = message.role === "ai"

  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div className={`flex ${isAi ? "flex-row" : "flex-row-reverse"} max-w-[80%] gap-3`}>
        {!isSequential && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={isAi ? "/placeholder.svg?height=32&width=32" : ""} />
            <AvatarFallback className={isAi ? "bg-blue-100 text-blue-600" : "bg-gray-100"}>
              {isAi ? "AI" : "You"}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={`space-y-1 ${isSequential ? (isAi ? "ml-11" : "mr-11") : ""}`}>
          <div className={`rounded-lg p-3 ${isAi ? "bg-blue-50 text-gray-800" : "bg-gray-100 text-gray-800"}`}>
            <p className="text-sm">{message.content}</p>
          </div>
          {!isSequential && (
            <p className="text-xs text-gray-500">{formatDistanceToNow(message.timestamp, { addSuffix: true })}</p>
          )}
        </div>
      </div>
    </div>
  )
}
