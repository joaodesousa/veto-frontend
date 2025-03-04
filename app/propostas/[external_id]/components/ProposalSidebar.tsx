import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getStatusColor } from "../../utils/colors"

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
}

// Define the props type for the ProposalSidebar component
interface ProposalSidebarProps {
  proposal: Proposal;
}

export function ProposalSidebar({ proposal }: ProposalSidebarProps) {
  const statusColor = getStatusColor(proposal.status)
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estado Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado:</span>
              <Badge className={statusColor}>
              {proposal.status}
              </Badge>
            </div>
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Última Atualização:</span>
                  <span className="text-sm">{proposal.lastUpdate}</span>
                </div>
              </>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deputados</CardTitle>
          <CardDescription>Deputados que propuseram esta iniciativa</CardDescription>
        </CardHeader>
        <CardContent>
          {proposal.deputies.length > 0 ? (
            <ul className="space-y-2">
              {proposal.deputies.map((deputy, index) => (
                <li key={`${deputy.name}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{deputy.name}</span>
                  </div>
                  {deputy.party && (
                    <Badge variant="outline" className="ml-2">
                      {deputy.party}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Não há informações sobre deputados disponíveis.</p>
          )}
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Subscrever Atualizações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Receba notificações sobre alterações nesta proposta legislativa.
          </p>
          <Button className="w-full">Subscrever</Button>
        </CardContent>
      </Card> */}
    </div>
  )
}