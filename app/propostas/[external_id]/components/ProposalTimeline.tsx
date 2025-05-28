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
    voteId?: string;
    hasVote?: boolean;
  }>;
  phases?: Phase[];
  onVoteClick?: (voteId: string) => void;
}

export function ProposalTimeline({ timeline, phases, onVoteClick }: ProposalTimelineProps) {
  // Use the hook to process phases if no timeline is provided
  const processedTimeline = useProcessTimeline(phases);
  
  // Use provided timeline or processed timeline from phases
  const displayTimeline = timeline || processedTimeline;
  
  // Reverse the timeline to show most recent first
  const reversedTimeline = displayTimeline ? [...displayTimeline].reverse() : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronologia da Proposta</CardTitle>
        <CardDescription>Acompanhe o percurso desta proposta legislativa</CardDescription>
      </CardHeader>
      <CardContent>
        {reversedTimeline && reversedTimeline.length > 0 ? (
          <Timeline>
            {reversedTimeline.map((item, index) => (
              <TimelineItem
                key={`${item.title}-${index}`}
                date={item.date}
                title={item.title}
                description={item.description}
                subitems={item.subitems}
                voteId={item.voteId}
                hasVote={item.hasVote}
                onVoteClick={onVoteClick}
                isLast={index === reversedTimeline.length - 1}
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