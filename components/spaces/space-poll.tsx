"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock } from "lucide-react"

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface SpacePollProps {
  title: string
  options: PollOption[]
  totalVotes: number
  timeLeft: string
  hasVoted?: boolean
  onVote?: (optionId: string) => void
}

export function SpacePoll({ title, options, totalVotes, timeLeft, hasVoted = false, onVote }: SpacePollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [voted, setVoted] = useState(hasVoted)

  const handleVote = () => {
    if (selectedOption && !voted) {
      onVote?.(selectedOption)
      setVoted(true)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {timeLeft}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="space-y-2">
              <div
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedOption === option.id ? "border-primary bg-primary/10" : "border-border hover:border-border/80"
                } ${voted ? "cursor-default" : ""}`}
                onClick={() => !voted && setSelectedOption(option.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{option.text}</span>
                  {voted && <span className="text-sm text-muted-foreground">{option.percentage}%</span>}
                </div>
                {voted && <Progress value={option.percentage} className="h-2" />}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">
            Votos: {totalVotes} • Cierra en {timeLeft}
          </span>
          {!voted && (
            <Button size="sm" onClick={handleVote} disabled={!selectedOption}>
              Votar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
