import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeline, TimelineItem } from "@/components/timeline"

// Define the type for the timeline items
interface TimelineItemType {
  date: string;
  title: string;
}

// Define the props type for the ProposalTimeline component
interface ProposalTimelineProps {
  timeline: TimelineItemType[];
}

export function ProposalTimeline({ timeline }: ProposalTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronologia da Proposta</CardTitle>
        <CardDescription>Acompanhe o percurso desta proposta legislativa</CardDescription>
      </CardHeader>
      <CardContent>
        {timeline.length > 0 ? (
          <Timeline>
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                date={item.date}
                title={item.title}
                isLast={index === timeline.length - 1}
              />
            ))}
          </Timeline>
        ) : (
          <p className="text-muted-foreground">Não há informações de cronologia disponíveis.</p>
        )}
      </CardContent>
    </Card>
  )
}