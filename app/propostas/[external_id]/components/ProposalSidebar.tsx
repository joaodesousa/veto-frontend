import { Users, Bell, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getStatusColor } from "../../../utils/colors"
import Link from "next/link"

// Define the type for the proposal object
interface Deputy {
  name: string;
  party?: string;
}

interface TimelineItem {
  title: string;
  date: string;
}

interface Proposal {
  status: string;
  timeline: TimelineItem[];
  deputies: Deputy[];
  lastUpdate: string;
  textLink: string | null;
}

// Define the props type for the ProposalSidebar component
interface ProposalSidebarProps {
  proposal: Proposal;
}

export function ProposalSidebar({ proposal }: ProposalSidebarProps) {
  const statusColor = getStatusColor(proposal.status);
  
  // Get the next step (for display purposes)
  const progressSteps = [
    "Apresentação",
    "Admissão",
    "Discussão na Comissão",
    "Audições Públicas",
    "Em Análise",
    "Votação na Especialidade",
    "Votação Final Global",
    "Promulgação",
    "Publicação",
  ];
  
  let currentStepIndex = 0;
  if (proposal.timeline && proposal.timeline.length > 0) {
    const lastPhaseTitle = proposal.timeline[proposal.timeline.length - 1].title;
    const matchingIndex = progressSteps.findIndex(step => 
      lastPhaseTitle.includes(step) || step.includes(lastPhaseTitle)
    );
    if (matchingIndex !== -1) {
      currentStepIndex = matchingIndex;
    }
  }
  
  const nextStep = currentStepIndex < progressSteps.length - 1 
    ? progressSteps[currentStepIndex + 1] 
    : "Concluído";
  
  return (
    <Card className="border-blue-100 dark:border-blue-800">
      <CardHeader>
        <CardTitle>Estado Atual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fase Atual:</span>
            <span className="text-sm">
              {proposal.timeline && proposal.timeline.length > 0
                ? proposal.timeline[proposal.timeline.length - 1].title
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Última Atualização:</span>
            <span className="text-sm">{proposal.lastUpdate}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Próxima Etapa:</span>
            <span className="text-sm">{nextStep}</span>
          </div>
        </div>
          
        <Link href={proposal.textLink || '#'} target="_blank">
          <Button className="w-full mt-4 gap-1.5 text-white">
            <FileText className="h-4 w-4" />
            Documento da Iniciativa
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}