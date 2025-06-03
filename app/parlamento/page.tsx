"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Building2, MapPin, Calendar, X, Mail, Phone, GraduationCap, Briefcase, Loader2, Smartphone, Monitor } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import * as d3 from 'd3'

// Party configuration with colors and full names
const partyConfig: Record<string, { name: string; color: string; leader?: string; founded?: string; ideology?: string }> = {
  "PSD": {
    name: "Partido Social Democrata", 
    color: "#FF8C00", // Orange
    leader: "Luís Montenegro",
    founded: "1974",
    ideology: "Democracia cristã, Liberalismo"
  },
  "PS": {
    name: "Partido Socialista",
    color: "#FF69B4", // Pink
    leader: "Pedro Nuno Santos",
    founded: "1973",
    ideology: "Social-democracia"
  },
  "CH": {
    name: "Chega", 
    color: "#000080", // Dark Blue
    leader: "André Ventura",
    founded: "2019",
    ideology: "Populismo de direita"
  },
  "IL": {
    name: "Iniciativa Liberal", 
    color: "#00FFFF", // Cyan
    leader: "Rui Rocha",
    founded: "2017",
    ideology: "Liberalismo clássico"
  },
  "BE": {
    name: "Bloco de Esquerda", 
    color: "#FF0000", // Bright Red
    leader: "Mariana Mortágua",
    founded: "1999",
    ideology: "Socialismo democrático"
  },
  "PCP": {
    name: "Partido Comunista Português",
    color: "#8B0000", // Dark Red
    leader: "Paulo Raimundo",
    founded: "1921",
    ideology: "Comunismo"
  },
  "PEV": {
    name: "Partido Ecologista Os Verdes",
    color: "#32CD32",
    leader: "Heloísa Apolónia",
    founded: "1982",
    ideology: "Política verde, Ecologismo"
  },
  "PAN": {
    name: "Pessoas-Animais-Natureza", 
    color: "#20B2AA", // Green with blue tint
    leader: "Inês Sousa Real",
    founded: "2009",
    ideology: "Política verde, Direitos dos animais"
  },
  "L": {
    name: "Livre", 
    color: "#00FF00", // Bright green
    leader: "Rui Tavares",
    founded: "2014",
    ideology: "Política verde, Europeísmo"
  },
  "CDS": {
    name: "Centro Democrático Social",
    color: "#0000FF", // Blue
    founded: "1974",
    ideology: "Conservadorismo, Democracia cristã"
  },
  "CDS-PP": {
    name: "Centro Democrático Social",
    color: "#0000FF", // Blue
    founded: "1974",
    ideology: "Conservadorismo, Democracia cristã"
  },
  "ADN": {
    name: "Aliança Democrática Nacional",
    color: "#4B0082",
    founded: "2020",
    ideology: "Conservadorismo"
  },
  "NInsc": {
    name: "Não Inscrito",
    color: "#808080", // Grey
    leader: "Vários",
    founded: "-",
    ideology: "Independente"
  },
  "Outros": {
    name: "Deputados Únicos", 
    color: "#808080", // Grey
    leader: "Vários",
    founded: "-",
    ideology: "Diversas"
  }
}

interface ApiDeputy {
  _id: string
  CadId?: number
  DepCadId?: number
  DepNomeCompleto: string
  DepNomeParlamentar: string
  DepCPDes: string
  CadProfissao?: string
  CadDtNascimento?: string
  CadDeputadoLegis?: Array<{
    // Legislature history - we'll use this to count mandates
    [key: string]: any
  }>
  DepGP: Array<{
    gpSigla: string
    gpDtInicio: string
    gpDtFim: string | null
  }>
  DepSituacao: Array<{
    sioDes: string
    sioDtInicio: string
    sioDtFim: string | null
  }>
}

interface Deputy {
  id: string
  photoId: string
  name: string
  fullName: string
  party: string
  partyName: string
  color: string
  constituency: string
  status: string
  age?: number
  profession?: string
  education?: string
  mandates?: number
  committees?: string[]
}

interface PartyData {
  party: string
  name: string
  seats: number
  color: string
  leader?: string
  founded?: string
  ideology?: string
  deputies: Deputy[]
}

// Dynamic import for d3-parliament-chart with better debugging
const loadParliamentChart = async () => {
  try {
    // @ts-ignore - d3-parliament-chart doesn't have types
    const module = await import('d3-parliament-chart')
    
    // Try different possible exports
    const parliamentChart = module.default || module.parliamentChart || module
    
    return parliamentChart
  } catch (error) {
    console.error('Failed to load d3-parliament-chart:', error)
    return null
  }
}

// Helper function to calculate age from birth date
const calculateAge = (birthDateString: string): number | undefined => {
  if (!birthDateString) return undefined
  
  const birthDate = new Date(birthDateString)
  if (isNaN(birthDate.getTime())) return undefined
  
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase())
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isMobileDevice || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export default function ParliamentPage() {
  const [selectedParty, setSelectedParty] = useState<PartyData | null>(null)
  const [hoveredDeputy, setHoveredDeputy] = useState<Deputy | null>(null)
  const [pinnedDeputy, setPinnedDeputy] = useState<Deputy | null>(null)
  const [highlightedParty, setHighlightedParty] = useState<string | null>(null)
  const [deputies, setDeputies] = useState<Deputy[]>([])
  const [parliamentData, setParliamentData] = useState<PartyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'partidos' | 'idade' | 'experiencia'>('partidos')
  const svgRef = useRef<SVGSVGElement>(null)
  const isMobile = useIsMobile()
  const [hoveredSegment, setHoveredSegment] = useState<any>(null)

  // Fetch deputy data from API
  useEffect(() => {
    const fetchDeputies = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://legis.veto.pt/api/deputados/efetivos?limit=230')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (!result.success || !result.data) {
          throw new Error('Invalid API response format')
        }

        // Transform API data to our format
        const transformedDeputies: Deputy[] = result.data.map((apiDeputy: ApiDeputy) => {
          // Get current party (most recent entry without end date)
          const currentParty = apiDeputy.DepGP.find(gp => !gp.gpDtFim) || apiDeputy.DepGP[0]
          const partyCode = currentParty?.gpSigla || "Outros"
          
          // Get current status
          const currentStatus = apiDeputy.DepSituacao.find(sit => !sit.sioDtFim) || apiDeputy.DepSituacao[0]
          
          const config = partyConfig[partyCode] || partyConfig["Outros"]
          
          return {
            id: apiDeputy._id,
            photoId: apiDeputy.CadId?.toString() || "",
            name: apiDeputy.DepNomeParlamentar,
            fullName: apiDeputy.DepNomeCompleto,
            party: partyCode,
            partyName: config.name,
            color: config.color,
            constituency: apiDeputy.DepCPDes,
            status: currentStatus?.sioDes || "Unknown",
            age: calculateAge(apiDeputy.CadDtNascimento || "") || undefined,
            profession: apiDeputy.CadProfissao,
            mandates: apiDeputy.CadDeputadoLegis?.length || 1, // Count actual legislatures
            committees: ["Educação", "Saúde", "Economia", "Defesa", "Ambiente"][Math.floor(Math.random() * 3)]
          }
        })

        // Group by party and create parliament data
        const partyGroups = transformedDeputies.reduce((acc, deputy) => {
          if (!acc[deputy.party]) {
            const config = partyConfig[deputy.party] || partyConfig["Outros"]
            acc[deputy.party] = {
              party: deputy.party,
              name: config.name,
              seats: 0,
              color: config.color,
              leader: config.leader,
              founded: config.founded,
              ideology: config.ideology,
              deputies: []
            }
          }
          acc[deputy.party].seats++
          acc[deputy.party].deputies.push(deputy)
          return acc
        }, {} as Record<string, PartyData>)

        const parliamentDataArray = Object.values(partyGroups).sort((a, b) => b.seats - a.seats)
        
        setDeputies(transformedDeputies)
        setParliamentData(parliamentDataArray)
        setError(null)
        
      } catch (err) {
        console.error('Error fetching deputies:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch deputy data')
      } finally {
        setLoading(false)
      }
    }

    fetchDeputies()
  }, [])

  // Prepare data for d3-parliament-chart with custom left-to-right order
  const chartData = useMemo(() => {
    if (filterType === 'partidos') {
      // Define the desired left-to-right order
      const partyOrder = ["BE", "PCP", "L", "PS", "PAN", "PSD", "CDS-PP", "IL", "CH"]
      
      const orderedData: any[] = []
      
      // Add parties in the specified order
      partyOrder.forEach(partyCode => {
        const party = parliamentData.find(p => p.party === partyCode)
        if (party && party.seats > 0) {
          orderedData.push({
            seats: party.seats,
            color: party.color,
            party: party.party,
            name: party.name
          })
        }
      })
      
      // Add any remaining parties that weren't in the specified order
      parliamentData.forEach(party => {
        if (!partyOrder.includes(party.party) && party.seats > 0) {
          orderedData.push({
            seats: party.seats,
            color: party.color,
            party: party.party,
            name: party.name
          })
        }
      })
      
      return orderedData
    } else if (filterType === 'idade') {
      // Age groups with grey to black gradient
      const ageGroups = [
        { range: "<30", name: "Menos de 30", color: "#D1D5DB", min: 0, max: 29 },
        { range: "30-49", name: "30 a 49", color: "#9CA3AF", min: 30, max: 49 },
        { range: "50-65", name: "50 a 65", color: "#6B7280", min: 50, max: 65 },
        { range: ">65", name: "Mais de 65", color: "#374151", min: 66, max: 100 }
      ]
      
      // Count deputies in each age group
      const ageCounts = ageGroups.map(group => {
        const count = deputies.filter(deputy => 
          deputy.age && deputy.age >= group.min && deputy.age <= group.max
        ).length
        
        return {
          seats: count,
          color: group.color,
          party: group.range,
          name: group.name
        }
      }).filter(group => group.seats > 0)
      
      return ageCounts
    } else if (filterType === 'experiencia') {
      // Experience groups based on real mandate data
      const experienceGroups = [
        { range: "1º", name: "1º Mandato", color: "#D1D5DB", min: 1, max: 1 },
        { range: "2-3", name: "2 a 3 Mandatos", color: "#9CA3AF", min: 2, max: 3 },
        { range: "4-5", name: "4 a 5 Mandatos", color: "#6B7280", min: 4, max: 5 },
        { range: "6+", name: "6 ou mais Mandatos", color: "#374151", min: 6, max: 20 }
      ]
      
      // Count deputies in each experience group
      const experienceCounts = experienceGroups.map(group => {
        const count = deputies.filter(deputy => 
          deputy.mandates && deputy.mandates >= group.min && deputy.mandates <= group.max
        ).length
        
        return {
          seats: count,
          color: group.color,
          party: group.range,
          name: group.name
        }
      }).filter(group => group.seats > 0)
      
      return experienceCounts
    }
    return []
  }, [parliamentData, deputies, filterType])

  // Create deputy mapping for seat clicks (always use party order for consistent positions)
  const deputyMapping = useMemo(() => {
    const mapping: Deputy[] = []
    
    // Always follow the same order as party-based chartData for consistent positions
    const partyOrder = ["BE", "PCP", "L", "PS", "PAN", "PSD", "CDS-PP", "IL", "CH"]
    
    // Add deputies in the specified party order
    partyOrder.forEach(partyCode => {
      const party = parliamentData.find(p => p.party === partyCode)
      if (party && party.seats > 0) {
        mapping.push(...party.deputies)
      }
    })
    
    // Add deputies from any remaining parties
    parliamentData.forEach(party => {
      if (!partyOrder.includes(party.party) && party.seats > 0) {
        mapping.push(...party.deputies)
      }
    })
    
    return mapping
  }, [parliamentData])

  // Get color for a deputy based on current filter
  const getDeputyColor = useCallback((deputy: Deputy, index: number) => {
    if (filterType === 'partidos') {
      return deputy.color
    } else if (filterType === 'idade') {
      const age = deputy.age
      if (!age) return "#9CA3AF" // Gray for unknown ages
      if (age < 30) return "#D1D5DB"
      if (age <= 49) return "#9CA3AF" 
      if (age <= 65) return "#6B7280"
      return "#374151"
    } else if (filterType === 'experiencia') {
      const mandates = deputy.mandates || 1
      if (mandates === 1) return "#D1D5DB"
      if (mandates <= 3) return "#9CA3AF"
      if (mandates <= 5) return "#6B7280"
      return "#374151"
    }
    return deputy.color
  }, [filterType])

  // Apply party highlighting to all seats
  const applyPartyHighlighting = useCallback((svg: any, partyToHighlight: string | null) => {
    svg.selectAll("circle")
      .attr("stroke", (d: any, i: number) => {
        const deputy = deputyMapping[i]
        if (!deputy || !partyToHighlight) return "none"
        return deputy.party === partyToHighlight ? "#60a5fa" : "none"
      })
      .attr("stroke-width", (d: any, i: number) => {
        const deputy = deputyMapping[i]
        if (!deputy || !partyToHighlight) return 0
        return deputy.party === partyToHighlight ? 3 : 0
      })
      .attr("opacity", (d: any, i: number) => {
        const deputy = deputyMapping[i]
        if (!partyToHighlight) return 1
        return deputy && deputy.party === partyToHighlight ? 1 : 0.3
      })
  }, [deputyMapping])

  // Clear party highlighting
  const clearPartyHighlighting = useCallback((svg: any) => {
    svg.selectAll("circle")
      .attr("stroke", "none")
      .attr("stroke-width", 0)
      .attr("opacity", 1)
  }, [])

  // Prepare pie chart data for center display
  const pieChartData = useMemo(() => {
    return chartData.map(party => ({
      name: party.party,
      value: party.seats,
      color: party.color,
      fullName: party.name
    }))
  }, [chartData])

  // Get title for current filter
  const getFilterTitle = () => {
    switch (filterType) {
      case 'partidos':
        return 'Deputados por Partido'
      case 'idade':
        return 'Deputados por Idade'
      case 'experiencia':
        return 'Deputados por Número de Mandatos'
      default:
        return 'Deputados'
    }
  }

  // Fallback parliament visualization using pure d3
  const renderFallbackChart = (svg: any, width: number, height: number) => {
    const totalSeats = deputyMapping.length
    let seatIndex = 0
    
    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height * 0.85})`)
    
    // Create hemicycle layout
    const rows = 8
    for (let row = 0; row < rows; row++) {
      const radius = 50 + (row * 25)
      const seatsInRow = Math.ceil(totalSeats / rows)
      const angleStep = Math.PI / (seatsInRow + 1)
      
      for (let seat = 0; seat < seatsInRow && seatIndex < totalSeats; seat++) {
        const angle = (seat + 1) * angleStep
        const x = radius * Math.cos(Math.PI - angle)
        const y = -radius * Math.sin(Math.PI - angle)
        
        // Get color for this seat based on current filter
        const deputy = deputyMapping[seatIndex]
        const color = deputy ? getDeputyColor(deputy, seatIndex) : "#808080"
        
        g.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 6)
          .attr("fill", color)
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr("cursor", "pointer")
          .style("pointer-events", "auto")
          .on("mouseover", function(this: SVGCircleElement) {
            // Show deputy info
            const deputy = deputyMapping[seatIndex]
            if (deputy) {
              setHoveredDeputy(deputy)
              // Highlight party members on age and experience filters
              if (filterType === 'idade' || filterType === 'experiencia') {
                setHighlightedParty(deputy.party)
                applyPartyHighlighting(svg, deputy.party)
              }
            }
          })
          .on("mouseout", function(this: SVGCircleElement) {
            if (!pinnedDeputy) {
              setHoveredDeputy(null)
              // Clear highlighting on age and experience filters
              if (filterType === 'idade' || filterType === 'experiencia') {
                setHighlightedParty(null)
                clearPartyHighlighting(svg)
              }
            }
          })
          .on("click", () => {
            const deputy = deputyMapping[seatIndex]
            if (deputy) {
              setPinnedDeputy(deputy)
              // Highlight party members on age and experience filters
              if (filterType === 'idade' || filterType === 'experiencia') {
                setHighlightedParty(deputy.party)
                applyPartyHighlighting(svg, deputy.party)
              }
            }
          })
        
        seatIndex++
      }
    }
  }

  // Render parliament chart
  useEffect(() => {
    if (!svgRef.current || chartData.length === 0 || loading) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous render

    const width = 800
    const height = 400

    const renderChart = async () => {
      try {
        const parliamentChart = await loadParliamentChart()
        
        if (parliamentChart) {
          // Try different usage patterns based on the documentation
          let chart
          
          // Pattern 1: Direct function call
          try {
            if (typeof parliamentChart === 'function') {
              chart = parliamentChart()
            } else {
              throw new Error('Not a function')
            }
          } catch (e) {
            // Pattern 2: Check if it's attached to d3
            try {
              // @ts-ignore
              if (d3.parliamentChart && typeof d3.parliamentChart === 'function') {
                // @ts-ignore
                chart = d3.parliamentChart()
              } else {
                throw new Error('d3.parliamentChart not found')
              }
            } catch (e2) {
              // Pattern 3: Try calling parliamentChart directly if it's a constructor
              try {
                chart = new parliamentChart()
              } catch (e3) {
                throw new Error('All patterns failed')
              }
            }
          }
          
          if (chart) {
            // Configure the chart
            chart
              .width(width)
              .aggregatedData(chartData)
              .sections(1)
              .sectionGap(256)
              .seatRadius(9)  
              .rowHeight(30)

            // Create the chart
            svg
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .call(chart);

            // Add click handlers
            svg.selectAll("circle")
              .style("cursor", "pointer")
              .style("pointer-events", "auto")
              .attr("fill", (d: any, i: number) => {
                // Apply color based on current filter
                const deputy = deputyMapping[i]
                return deputy ? getDeputyColor(deputy, i) : "#808080"
              })
              .on("mouseover", function(this: any) {
                // Show deputy info
                const allSeats = svg.selectAll("circle").nodes()
                const hoveredSeatIndex = allSeats.indexOf(this)
                const deputy = deputyMapping[hoveredSeatIndex]
                if (deputy) {
                  setHoveredDeputy(deputy)
                  // Highlight party members on age and experience filters
                  if (filterType === 'idade' || filterType === 'experiencia') {
                    setHighlightedParty(deputy.party)
                    applyPartyHighlighting(svg, deputy.party)
                  }
                }
              })
              .on("mouseout", function(this: any) {
                if (!pinnedDeputy) {
                  setHoveredDeputy(null)
                  // Clear highlighting on age and experience filters
                  if (filterType === 'idade' || filterType === 'experiencia') {
                    setHighlightedParty(null)
                    clearPartyHighlighting(svg)
                  }
                }
              })
              .on("click", function(this: any) {
                const allSeats = svg.selectAll("circle").nodes()
                const clickedSeatIndex = allSeats.indexOf(this)
                const deputy = deputyMapping[clickedSeatIndex]
                if (deputy) {
                  setPinnedDeputy(deputy)
                  // Highlight party members on age and experience filters
                  if (filterType === 'idade' || filterType === 'experiencia') {
                    setHighlightedParty(deputy.party)
                    applyPartyHighlighting(svg, deputy.party)
                  }
                }
              })

            return // Success, exit early
          }
        }
        
        throw new Error('Failed to create chart')
        
      } catch (error) {
        console.error("Error with d3-parliament-chart, using fallback:", error)
        
        // Use fallback visualization
        svg.attr("width", width).attr("height", height)
        renderFallbackChart(svg, width, height)
      }
    }

    renderChart()
  }, [chartData, deputyMapping, loading])

  const totalSeats = parliamentData.reduce((sum, party) => sum + party.seats, 0)

  if (loading) {
    // Mobile skeleton
    if (isMobile) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white">
          <div className="container relative z-10 mx-auto p-6 pt-24 pb-32">
            {/* Parliament Information */}
            <div className="border-b border-white/10">
              <div className="container py-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-3xl font-bold tracking-tight">Parlamento Português</h1>
                  <p className="text-gray-400">
                    XVI Legislatura • 230 Deputados • Palácio de São Bento, Lisboa
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Parliament Overview Skeleton */}
            <div className="py-8 space-y-6">
              {/* Quick Stats Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-center">
                    <div className="h-8 w-16 bg-white/20 rounded-lg animate-pulse mx-auto mb-2"></div>
                    <div className="h-4 w-20 bg-white/10 rounded-lg animate-pulse mx-auto"></div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-center">
                    <div className="h-8 w-12 bg-white/20 rounded-lg animate-pulse mx-auto mb-2"></div>
                    <div className="h-4 w-16 bg-white/10 rounded-lg animate-pulse mx-auto"></div>
                  </div>
                </div>
              </div>

              {/* Party Breakdown Skeleton */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-6 w-48 bg-white/20 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="flex flex-col gap-1">
                          <div className="h-4 w-12 bg-white/20 rounded animate-pulse"></div>
                          <div className="h-3 w-32 bg-white/10 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-8 bg-white/20 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-12 bg-white/10 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demographics Skeletons */}
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-6 w-36 bg-white/20 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-4 w-6 bg-white/20 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Interactive Notice */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Monitor className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Visualização Interativa
                    </h4>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      Explore a composição do Parlamento de forma interativa num ecrã maior. 
                      Veja deputados individuais, filtre por idade ou experiência, e descubra 
                      detalhes sobre cada representante.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-400">
                      <Monitor className="w-4 h-4" />
                      <span>Disponível em desktop e tablet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Desktop skeleton
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white overflow-hidden">
        <div className="container relative z-10 mx-auto p-6 pt-24 pb-32">
          {/* Parliament Information */}
          <div className="border-b">
            <div className="container py-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Parlamento Português</h1>
                <p className="text-muted-foreground">
                  XVI Legislatura • 230 Deputados • Palácio de São Bento, Lisboa
                </p>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-center gap-4 mb-8 mt-12">
            <span className="text-sm text-gray-400">Ver por:</span>
            <div className="flex gap-2">
              <div className="px-6 py-2 rounded-full text-sm font-medium bg-blue-600 text-white shadow-lg">
                Partidos
              </div>
              <div className="px-6 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-300 border border-white/20">
                Idade
              </div>
              <div className="px-6 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-300 border border-white/20">
                Mandatos
              </div>
            </div>
          </div>

          {/* Legend Skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
                <div className="h-4 w-12 bg-white/10 rounded animate-pulse"></div>
                <div className="h-3 w-8 bg-white/5 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Parliament Visualization Skeleton */}
          <div className="flex justify-center -mb-24 relative z-20 pointer-events-none">
            <div className="pointer-events-none">
              <div className="w-[800px] h-[400px] bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full animate-pulse mx-auto mb-4"></div>
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pie Chart Skeleton */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="w-64 h-64 relative">
              <div className="w-full h-full bg-white/5 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  // Mobile fallback component
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white">
        <div className="container relative z-10 mx-auto p-6 pt-24 pb-32">
          {/* Parliament Information */}
          <div className="border-b border-white/10">
            <div className="container py-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Parlamento Português</h1>
                <p className="text-gray-400">
                  XVI Legislatura • 230 Deputados • Palácio de São Bento, Lisboa
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Parliament Overview */}
          <div className="py-8 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{totalSeats}</div>
                  <div className="text-sm text-gray-300">Deputados</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{parliamentData.length}</div>
                  <div className="text-sm text-gray-300">Partidos</div>
                </div>
              </div>
            </div>

            {/* Party Breakdown */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Composição Partidária
              </h3>
              <div className="space-y-3">
                {parliamentData.map(party => (
                  <div key={party.party} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: party.color }}
                      />
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{party.party}</span>
                        <span className="text-xs text-gray-400">{party.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{party.seats}</div>
                      <div className="text-xs text-gray-400">
                        {((party.seats / totalSeats) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Demographics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Demografia Etária
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Menos de 30</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.age && d.age < 30).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">30 a 49 anos</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.age && d.age >= 30 && d.age <= 49).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">50 a 65 anos</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.age && d.age >= 50 && d.age <= 65).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Mais de 65</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.age && d.age >= 66).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Experience Levels */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-400" />
                Experiência Parlamentar
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">1º Mandato</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.mandates === 1).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">2 a 3 Mandatos</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.mandates && d.mandates >= 2 && d.mandates <= 3).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">4 a 5 Mandatos</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.mandates && d.mandates >= 4 && d.mandates <= 5).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">6 ou mais Mandatos</span>
                  <span className="text-white font-medium">
                    {deputies.filter(d => d.mandates && d.mandates >= 6).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Version Notice */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Monitor className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Visualização Interativa
                  </h4>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    Explore a composição do Parlamento de forma interativa num ecrã maior. 
                    Veja deputados individuais, filtre por idade ou experiência, e descubra 
                    detalhes sobre cada representante.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-400">
                    <Monitor className="w-4 h-4" />
                    <span>Disponível em desktop e tablet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white overflow-hidden">
      <div className="container relative z-10 mx-auto p-6 pt-24 pb-32"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Parliament Information */}
        <div className="border-b">
          <div className="container py-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Parlamento Português</h1>
              <p className="text-muted-foreground">
                XVI Legislatura • 230 Deputados • Palácio de São Bento, Lisboa
              </p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8 mt-12">
          <span className="text-sm text-gray-400">Ver por:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('partidos')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === 'partidos'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
              }`}
            >
              Partidos
            </button>
            <button
              onClick={() => setFilterType('idade')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === 'idade'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
              }`}
            >
              Idade
            </button>
            <button
              onClick={() => setFilterType('experiencia')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === 'experiencia'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
              }`}
            >
              Mandatos  
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {filterType === 'partidos' && parliamentData.map(party => (
            <div key={party.party} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: party.color }}
              />
              <span className="text-sm text-gray-300 leading-4">{party.party}</span>
              <span className="text-xs text-gray-400 leading-4">
                ({party.seats})
              </span>
            </div>
          ))}
          
          {filterType === 'idade' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#D1D5DB] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">Menos de 30</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.age && d.age <= 29).length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#9CA3AF] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">30 a 49</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.age && d.age >= 30 && d.age <= 49).length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#6B7280] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">50 a 65</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.age && d.age >= 50 && d.age <= 65).length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#374151] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">Mais de 65</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.age && d.age >= 66).length})
                </span>
              </div>
              {deputies.filter(d => !d.age).length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#9CA3AF] flex-shrink-0" />
                  <span className="text-sm text-gray-300 leading-4">Idade desconhecida</span>
                  <span className="text-xs text-gray-400 leading-4">
                    ({deputies.filter(d => !d.age).length})
                  </span>
                </div>
              )}
            </>
          )}
          
          {filterType === 'experiencia' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#D1D5DB] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">1º Mandato</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.mandates === 1).length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#9CA3AF] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">2 a 3 Mandatos</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.mandates && d.mandates >= 2 && d.mandates <= 3).length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#6B7280] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">4 a 5 Mandatos</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.mandates && d.mandates >= 4 && d.mandates <= 5).length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#374151] flex-shrink-0" />
                <span className="text-sm text-gray-300 leading-4">6 ou mais Mandatos</span>
                <span className="text-xs text-gray-400 leading-4">
                  ({deputies.filter(d => d.mandates && d.mandates >= 6).length})
                </span>
              </div>
            </>
          )}
        </div>

        {/* Parliament Visualization */}
        <div className="flex justify-center -mb-24 relative z-20 pointer-events-none" onClick={() => {
          setPinnedDeputy(null)
          if (filterType === 'idade' || filterType === 'experiencia') {
            setHighlightedParty(null)
            const svg = d3.select(svgRef.current)
            clearPartyHighlighting(svg)
          }
        }}>
          <div className="pointer-events-none">
                  <svg
                    ref={svgRef}
                    className="w-full h-auto relative z-30 pointer-events-none"
                    onClick={(e) => e.stopPropagation()}
                  />
          </div>
                </div>
                
        {/* Pie Chart / Deputy Bio - Below Parliament */}
        <div 
          className="flex justify-center mb-8 relative z-10" 
          onClick={() => {
            setPinnedDeputy(null)
            if (filterType === 'idade' || filterType === 'experiencia') {
              setHighlightedParty(null)
              const svg = d3.select(svgRef.current)
              clearPartyHighlighting(svg)
            }
          }}
        >
          <div className="w-64 h-64 relative" onClick={(e) => e.stopPropagation()}>
            {(pinnedDeputy || hoveredDeputy) ? (
              /* Deputy Bio Card */
              <div className="w-full h-full pt-24 flex flex-col items-center justify-center pointer-events-auto">
                {/* Deputy Photo with Party Ring */}
                <div className="mb-6 relative">
                  <div 
                    className="w-36 h-36 rounded-full p-1 shadow-lg"
                    style={{ backgroundColor: (pinnedDeputy || hoveredDeputy)!.color }}
                  >
                    <Image
                      src={`/api/deputy-image/${(pinnedDeputy || hoveredDeputy)!.photoId}`}
                      alt={(pinnedDeputy || hoveredDeputy)!.name}
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-contain bg-gray-300 opacity-0 transition-opacity duration-150"
                      onLoad={(e) => {
                        // Quick fade-in when image loads
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '1';
                      }}
                      onError={(e) => {
                        // Show initials if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.initials-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      priority={true}
                      unoptimized={true}
                    />
                    
                    {/* Initials fallback - hidden by default, shown only on error */}
                    <div className="initials-fallback w-full h-full rounded-full bg-gray-300 items-center justify-center text-gray-600 font-bold text-2xl hidden absolute inset-1">
                      {(pinnedDeputy || hoveredDeputy)!.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  </div>
                  
                  {/* Party Name on Ring */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 px-3 py-1 rounded-full shadow-sm"
                    style={{ backgroundColor: (pinnedDeputy || hoveredDeputy)!.color }}
                  >
                    <span className="text-sm font-semibold text-white whitespace-nowrap">
                      {(pinnedDeputy || hoveredDeputy)!.party}
                    </span>
                  </div>
                </div>
                
                {/* Deputy Name */}
                <h3 className="text-xl font-bold text-white text-center mb-4">
                  {(pinnedDeputy || hoveredDeputy)!.name}
                </h3>
                
                {/* Age and Profession */}
                <div className="mb-4 text-center">
                  <p className="text-md whitespace-nowrap text-white mb-1">
                    {(pinnedDeputy || hoveredDeputy)!.age ? `${(pinnedDeputy || hoveredDeputy)!.age} anos` : 'Idade desconhecida'} | {(pinnedDeputy || hoveredDeputy)!.profession || 'Profissão não especificada'}
                  </p>
                  <p className="text-sm text-gray-300">
                    {(pinnedDeputy || hoveredDeputy)!.mandates === 1 ? '1º mandato' : `${(pinnedDeputy || hoveredDeputy)!.mandates || 1} mandatos`}
                  </p>
              </div>
                
                {/* Electoral Circle Pill */}
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <p className="text-sm font-medium text-white uppercase tracking-wide">
                    {(pinnedDeputy || hoveredDeputy)!.constituency}
                  </p>
                </div>
              </div>
            ) : (
              /* Pie Chart */
              <>
                    <ChartContainer
                      config={pieChartData.reduce((acc, item) => ({
                        ...acc,
                        [item.name]: {
                      label: item.fullName,
                          color: item.color,
                        }
                      }), {})}
                  className="h-full w-full pointer-events-auto relative z-20 chart-container"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={100}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            animationBegin={0}
                            isAnimationActive={false}
                            onMouseEnter={(data, index) => setHoveredSegment(data)}
                            onMouseLeave={() => setHoveredSegment(null)}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                                stroke={hoveredSegment && hoveredSegment.name === entry.name ? "#60a5fa" : "none"}
                                strokeWidth={hoveredSegment && hoveredSegment.name === entry.name ? 3 : 0}
                                opacity={hoveredSegment ? (hoveredSegment.name === entry.name ? 1 : 0.3) : 1}
                                style={{ cursor: "pointer" }}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                      <div className="text-center">
                    {hoveredSegment ? (
                      <>
                        <div className="text-3xl font-bold text-white mb-1">{hoveredSegment.value}</div>
                        <div className="text-sm text-gray-300 font-medium mb-1">{hoveredSegment.fullName || hoveredSegment.name}</div>
                        <div className="text-xs text-gray-400">
                          {((hoveredSegment.value / totalSeats) * 100).toFixed(1)}% do total
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-white mb-1">{totalSeats}</div>
                        <div className="text-sm text-gray-300 font-medium">{getFilterTitle()}</div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
              </div>
            </div>

            {/* Selected Party Info */}
            {selectedParty && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Informações do Partido</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedParty(null)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">Nome Completo</label>
                    <p className="text-sm font-medium text-white">{selectedParty.name}</p>
                  </div>
                {selectedParty.leader && (
                  <div>
                    <label className="text-xs text-gray-400">Líder</label>
                    <p className="text-sm text-gray-300">{selectedParty.leader}</p>
                  </div>
                )}
                {selectedParty.founded && (
                  <div>
                    <label className="text-xs text-gray-400">Fundação</label>
                    <p className="text-sm text-gray-300">{selectedParty.founded}</p>
                  </div>
                )}
                {selectedParty.ideology && (
                  <div>
                    <label className="text-xs text-gray-400">Ideologia</label>
                    <p className="text-sm text-gray-300">{selectedParty.ideology}</p>
                  </div>
                )}
                  <div>
                    <label className="text-xs text-gray-400">Deputados</label>
                    <p className="text-sm text-gray-300">{selectedParty.seats} ({((selectedParty.seats / totalSeats) * 100).toFixed(1)}%)</p>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 