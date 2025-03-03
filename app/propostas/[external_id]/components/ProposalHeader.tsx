import { Calendar, FileText, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "../../../utils/colors"

// Define the type for the proposal object
interface Tag {
  // Define the structure of a tag if needed, or use string if it's just a string
  name: string;
}

interface Author {
  name: string; // Adjust based on the actual structure of an author
}

interface Proposal {
  id: number;
  status: string;
  tags: Tag[];
  title: string;
  number: string;
  date: string;
  authors: Author[];
}

interface FormattedProposal {
  status: string;
  tags: { name: string }[];
  title: string;
  number: string;
  date: string;
  authors: { name: string }[];
}

// Define the props type for the ProposalHeader component
interface ProposalHeaderProps {
  proposal: FormattedProposal;
}

export function ProposalHeader({ proposal }: ProposalHeaderProps) {
  const statusColor = getStatusColor(proposal.status)
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge className={statusColor}>
          {proposal.status}
        </Badge>
        {proposal.tags.map((tag) => (
          <Badge key={tag.name} variant="secondary"> {/* Assuming tag has a name property */}
            {tag.name}
          </Badge>
        ))}
      </div>
      <h1 className="text-3xl font-bold">{proposal.title}</h1>
      <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          {proposal.number}
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