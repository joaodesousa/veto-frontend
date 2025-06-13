import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LegislatureNotice() {
  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <strong>Nota importante:</strong> Os dados referentes à nova legislatura ainda não foram disponibilizados pela Assembleia da República.
      </AlertDescription>
    </Alert>
  )
} 