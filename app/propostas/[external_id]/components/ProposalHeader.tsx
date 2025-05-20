import { Calendar, FileText, Users } from "lucide-react"
import { getStatusColor } from "../../../utils/colors"
import type { FormattedProposal } from "../../../../lib/types"

interface ProposalTabsProps {
  proposal: FormattedProposal;
}

interface Tag {
  name: string;
}

interface Author {
  name: string;
}



// Define the props type for the ProposalHeader component
interface ProposalHeaderProps {
  proposal: FormattedProposal;
}

export function ProposalHeader({ proposal }: ProposalHeaderProps) {
  // Use descType if available, otherwise fall back to type or the first part of number
  const type = proposal.descType || proposal.type || proposal.number.split(' ')[0];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{proposal.title}</h1>
      <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          {type}
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          {proposal.date}
        </div>
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          {proposal.authors.length} autor{proposal.authors.length !== 1 ? "es" : ""}
        </div>
      </div>
    </div>
  )
}