// app/propostas/[external_id]/components/ProposalTimeline.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeline, TimelineItem } from "@/components/timeline"
import { Phase } from "@/lib/types"
import { useProcessTimeline } from "@/hooks/ProcessTimeline"

// Interface for the component props
interface ProposalTimelineProps {
  timeline?: Array<{
    date: string;
    title: string;
    description: string;
    subitems?: Array<{
      date: string;
      title: string;
      description: string;
    }>;
  }>;
  phases?: Phase[];
}

export function ProposalTimeline({ timeline, phases }: ProposalTimelineProps) {
  // Use the hook to process phases if no timeline is provided
  const processedTimeline = useProcessTimeline(phases);
  
  // Use provided timeline or processed timeline from phases
  const displayTimeline = timeline || processedTimeline;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronologia da Proposta</CardTitle>
        <CardDescription>Acompanhe o percurso desta proposta legislativa</CardDescription>
      </CardHeader>
      <CardContent>
        {displayTimeline && displayTimeline.length > 0 ? (
          <Timeline>
            {displayTimeline.map((item, index) => (
              <TimelineItem
                key={`${item.title}-${index}`}
                date={item.date}
                title={item.title}
                description={item.description}
                subitems={item.subitems}
                isLast={index === displayTimeline.length - 1}
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