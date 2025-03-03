import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProposalAboutProps {
  description: string;
}

export function ProposalAbout({ description }: ProposalAboutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre a Proposta</CardTitle>
        <CardDescription>Descrição e detalhes da proposta legislativa</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}