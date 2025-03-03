// Get color classes based on status
export function getStatusColor(status: string): string {
    const statusMapping: Record<string, string> = {
      "Aprovada": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      "Rejeitada": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      "Caducada": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      "Em Comissão": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      "Em Discussão": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "Agendada": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      "Em Processamento": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    };
  
    // Return the color for the given status, or a default color if status not found
    return statusMapping[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }