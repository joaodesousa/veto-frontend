import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the type for the document items
interface Document {
  title: string;
  date: string;
  url: string;
}

// Define the props type for the ProposalDocuments component
interface ProposalDocumentsProps {
  documents: Document[];
}

export function ProposalDocuments({ documents }: ProposalDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Relacionados</CardTitle>
        <CardDescription>Aceda aos documentos oficiais desta proposta</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Não há documentos disponíveis.</p>
        )}
      </CardContent>
    </Card>
  )
}