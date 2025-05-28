// Phase mapping to main categories
export const PHASE_MAPPING: Record<string, string[]> = {
  "Generalidade": [
    "Admissão",
    "Entrada", 
    "Anúncio",
    "Discussão generalidade",
    "Votação na generalidade",
    "Discussão generalidade decreto",
    "Votação generalidade decreto",
    "Baixa comissão distribuição inicial generalidade",
    "Requerimento Baixa Comissão sem Votação (Generalidade)",
    "Requerimento baixa comissão generalidade (DV)",
    "Requerimento baixa comissão generalidade AV",
    "Votação requerimento baixa comissão generalidade (AV)",
    "Nova apreciação comissão generalidade",
    "Requerimento de adiamento de Votação (Generalidade)",
    "Votação requerimento de baixa comissão depois votação generalidade"
  ],
  "Especialidade": [
    "Baixa comissão especialidade",
    "Discussão especialidade",
    "Votação na especialidade", 
    "Discussão especialidade decreto em Plenário",
    "Votação especialidade decreto",
    "Nova apreciação na especialidade em Comissão",
    "Requerimento Baixa Comissão sem Votação (Especialidade)",
    "Requerimento Votação Especialidade",
    "Requerimento Votação Especialidade (Final Global)",
    "Requerimento de adiamento de Votação (Especialidade)",
    "Requerimento sem Votação para Apreciação  Especialidade",
    "Votação Propostas de Alteração"
  ],
  "Final": [
    "Votação final global",
    "Votação final global decreto", 
    "Votação global",
    "Promulgação",
    "Promulgação (2ª versão)",
    "Promulgação (3ª versão)",
    "Promulgação novo decreto / decreto confirmado",
    "Publicação",
    "Lei (Publicação DR)",
    "Decreto (Publicação)",
    "Decreto (2ª versão) (Publicação)",
    "Decreto (3ª versão) (Publicação)",
    "Resolução (Publicação DAR)",
    "Resolução da AR (Publicação DR)",
    "Regimento (Publicação DAR)",
    "Regimento da AR (Publicação DR)",
    "Deliberação (Publicação DAR)",
    "Concluída",
    "Envio ao Presidente da República",
    "Envio para Promulgação (3ª versão)",
    "Envio para promulgação",
    "Envio para promulgação (2ª versão)",
    "Envio para promulgação novo decreto / decreto confirmado"
  ]
}

// Category descriptions for better UX
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Generalidade": "Discussão inicial e votação na generalidade",
  "Especialidade": "Análise detalhada em comissões especializadas",
  "Final": "Votação final, promulgação e publicação"
}

// Category colors for visual distinction
export const CATEGORY_COLORS: Record<string, string> = {
  "Generalidade": "bg-blue-50 border-blue-200 text-blue-800",
  "Especialidade": "bg-amber-50 border-amber-200 text-amber-800", 
  "Final": "bg-green-50 border-green-200 text-green-800"
}

// Detailed phase progress mapping - maps specific phases to progress percentages
export const PHASE_PROGRESS: Record<string, number> = {
  // Initial phases (0-15%)
  "Entrada": 5,
  "Admissão": 10,
  "Anúncio": 15,
  
  // Generalidade phases (15-40%)
  "Discussão generalidade": 25,
  "Discussão generalidade decreto": 25,
  "Votação na generalidade": 35,
  "Votação generalidade decreto": 35,
  "Baixa comissão distribuição inicial generalidade": 40,
  "Requerimento Baixa Comissão sem Votação (Generalidade)": 30,
  "Requerimento baixa comissão generalidade (DV)": 30,
  "Requerimento baixa comissão generalidade AV": 30,
  "Votação requerimento baixa comissão generalidade (AV)": 35,
  "Nova apreciação comissão generalidade": 32,
  "Requerimento de adiamento de Votação (Generalidade)": 28,
  "Votação requerimento de baixa comissão depois votação generalidade": 38,
  
  // Especialidade phases (40-70%)
  "Baixa comissão especialidade": 45,
  "Discussão especialidade": 55,
  "Discussão especialidade decreto em Plenário": 55,
  "Votação na especialidade": 65,
  "Votação especialidade decreto": 65,
  "Nova apreciação na especialidade em Comissão": 60,
  "Requerimento Baixa Comissão sem Votação (Especialidade)": 50,
  "Requerimento Votação Especialidade": 62,
  "Requerimento Votação Especialidade (Final Global)": 68,
  "Requerimento de adiamento de Votação (Especialidade)": 58,
  "Requerimento sem Votação para Apreciação  Especialidade": 52,
  "Votação Propostas de Alteração": 63,
  
  // Final phases (70-100%)
  "Votação final global": 75,
  "Votação final global decreto": 75,
  "Votação global": 75,
  "Envio ao Presidente da República": 80,
  "Envio para promulgação": 80,
  "Envio para promulgação (2ª versão)": 82,
  "Envio para Promulgação (3ª versão)": 84,
  "Envio para promulgação novo decreto / decreto confirmado": 83,
  "Promulgação": 90,
  "Promulgação (2ª versão)": 92,
  "Promulgação (3ª versão)": 94,
  "Promulgação novo decreto / decreto confirmado": 93,
  "Publicação": 100,
  "Lei (Publicação DR)": 100,
  "Decreto (Publicação)": 100,
  "Decreto (2ª versão) (Publicação)": 100,
  "Decreto (3ª versão) (Publicação)": 100,
  "Resolução (Publicação DAR)": 100,
  "Resolução da AR (Publicação DR)": 100,
  "Regimento (Publicação DAR)": 100,
  "Regimento da AR (Publicação DR)": 100,
  "Deliberação (Publicação DAR)": 100,
  "Concluída": 100,
}

// Function to calculate progress based on actual phases
export const calculateProposalProgress = (phases: Array<{ name: string; date: string }> | undefined): {
  percentage: number;
  currentPhase: string;
  category: string;
  description: string;
} => {
  if (!phases || phases.length === 0) {
    return {
      percentage: 0,
      currentPhase: "Não iniciado",
      category: "Inicial",
      description: "Proposta ainda não iniciou o processo legislativo"
    };
  }

  // Sort phases by date to get the most recent one
  const sortedPhases = [...phases].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const currentPhase = sortedPhases[0];
  const phaseTitle = currentPhase.name;

  // Check if we have a specific progress mapping for this phase
  if (PHASE_PROGRESS[phaseTitle]) {
    const category = getCategoryForPhase(phaseTitle);
    return {
      percentage: PHASE_PROGRESS[phaseTitle],
      currentPhase: phaseTitle,
      category,
      description: CATEGORY_DESCRIPTIONS[category] || "Fase do processo legislativo"
    };
  }

  // Fallback: try to match partial phase names or use category-based progress
  const category = getCategoryForPhase(phaseTitle);
  let fallbackPercentage = 0;

  switch (category) {
    case "Generalidade":
      fallbackPercentage = 30;
      break;
    case "Especialidade":
      fallbackPercentage = 60;
      break;
    case "Final":
      fallbackPercentage = 85;
      break;
    default:
      // Try to infer from phase name keywords
      if (phaseTitle.toLowerCase().includes("publicação") || phaseTitle.toLowerCase().includes("concluída")) {
        fallbackPercentage = 100;
      } else if (phaseTitle.toLowerCase().includes("promulgação")) {
        fallbackPercentage = 90;
      } else if (phaseTitle.toLowerCase().includes("votação final") || phaseTitle.toLowerCase().includes("votação global")) {
        fallbackPercentage = 75;
      } else if (phaseTitle.toLowerCase().includes("especialidade")) {
        fallbackPercentage = 60;
      } else if (phaseTitle.toLowerCase().includes("generalidade")) {
        fallbackPercentage = 30;
      } else if (phaseTitle.toLowerCase().includes("admissão") || phaseTitle.toLowerCase().includes("entrada")) {
        fallbackPercentage = 10;
      } else {
        fallbackPercentage = 20; // Default for unknown phases
      }
  }

  return {
    percentage: fallbackPercentage,
    currentPhase: phaseTitle,
    category,
    description: CATEGORY_DESCRIPTIONS[category] || "Fase do processo legislativo"
  };
};

// Helper function to determine which category a phase belongs to
const getCategoryForPhase = (phaseTitle: string): string => {
  for (const [category, phases] of Object.entries(PHASE_MAPPING)) {
    if (phases.includes(phaseTitle)) {
      return category;
    }
  }
  return "Outras";
};

// Utility function to get smart phase badges
export const getSmartPhaseBadges = (selectedPhases: string[], allPhases: string[]) => {
  const badges: Array<{ key: string; label: string; isCategory: boolean; phases?: string[] }> = []
  
  // Check which categories are fully selected
  const selectedCategories: string[] = []
  const remainingPhases = [...selectedPhases]
  
  // Check each category
  Object.entries(PHASE_MAPPING).forEach(([category, categoryPhases]) => {
    const availableCategoryPhases = categoryPhases.filter(phase => allPhases.includes(phase))
    const selectedCategoryPhases = availableCategoryPhases.filter(phase => selectedPhases.includes(phase))
    
    // If all phases in this category are selected, treat it as a category selection
    if (availableCategoryPhases.length > 0 && selectedCategoryPhases.length === availableCategoryPhases.length) {
      selectedCategories.push(category)
      badges.push({
        key: `category-${category}`,
        label: category,
        isCategory: true,
        phases: availableCategoryPhases
      })
      
      // Remove these phases from remaining phases
      availableCategoryPhases.forEach(phase => {
        const index = remainingPhases.indexOf(phase)
        if (index > -1) {
          remainingPhases.splice(index, 1)
        }
      })
    }
  })
  
  // Add remaining individual phases
  remainingPhases.forEach(phase => {
    badges.push({
      key: `phase-${phase}`,
      label: phase,
      isCategory: false
    })
  })
  
  return badges
} 