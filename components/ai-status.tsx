import { CircleOff, Wand2, Mic, Brain } from "lucide-react"

interface AiStatusProps {
  status: "speaking" | "listening" | "thinking" | "offline"
}

export default function AiStatus({ status }: AiStatusProps) {
  let icon
  let label
  let colorClass

  switch (status) {
    case "speaking":
      icon = <Wand2 size={16} className="animate-pulse" />
      label = "AI is speaking"
      colorClass = "bg-blue-100 text-blue-600"
      break
    case "listening":
      icon = <Mic size={16} className="animate-pulse" />
      label = "AI is listening"
      colorClass = "bg-green-100 text-green-600"
      break
    case "thinking":
      icon = <Brain size={16} className="animate-pulse" />
      label = "AI is thinking"
      colorClass = "bg-amber-100 text-amber-600"
      break
    case "offline":
    default:
      icon = <CircleOff size={16} />
      label = "AI is offline"
      colorClass = "bg-gray-100 text-gray-600"
      break
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colorClass}`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}
