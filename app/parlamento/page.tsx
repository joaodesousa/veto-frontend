"use client"

import { useState, useMemo } from "react"
import parliamentSVG from "parliament-svg"
import { toHtml as toSvg } from "hast-util-to-html"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building2, MapPin, Calendar, X, Mail, Phone, GraduationCap, Briefcase } from "lucide-react"

// Portuguese Parliament data (230 seats total) - Current composition
const parliamentData = [
  { 
    party: "PS", 
    name: "Partido Socialista", 
    seats: 78, 
    color: "#FF1493",
    leader: "Pedro Nuno Santos",
    founded: "1973",
    ideology: "Social-democracia"
  },
  { 
    party: "PSD", 
    name: "Partido Social Democrata", 
    seats: 77, 
    color: "#FF8C00",
    leader: "Luís Montenegro",
    founded: "1974",
    ideology: "Democracia cristã, Liberalismo"
  },
  { 
    party: "Chega", 
    name: "Chega", 
    seats: 18, 
    color: "#000080",
    leader: "André Ventura",
    founded: "2019",
    ideology: "Populismo de direita"
  },
  { 
    party: "IL", 
    name: "Iniciativa Liberal", 
    seats: 8, 
    color: "#00CED1",
    leader: "Rui Rocha",
    founded: "2017",
    ideology: "Liberalismo clássico"
  },
  { 
    party: "BE", 
    name: "Bloco de Esquerda", 
    seats: 5, 
    color: "#DC143C",
    leader: "Mariana Mortágua",
    founded: "1999",
    ideology: "Socialismo democrático"
  },
  { 
    party: "CDU", 
    name: "Coligação Democrática Unitária", 
    seats: 6, 
    color: "#228B22",
    leader: "Paula Santos",
    founded: "1987",
    ideology: "Comunismo, Ecologismo"
  },
  { 
    party: "PAN", 
    name: "Pessoas-Animais-Natureza", 
    seats: 1, 
    color: "#32CD32",
    leader: "Inês Sousa Real",
    founded: "2009",
    ideology: "Política verde, Direitos dos animais"
  },
  { 
    party: "Livre", 
    name: "Livre", 
    seats: 1, 
    color: "#FFD700",
    leader: "Rui Tavares",
    founded: "2014",
    ideology: "Política verde, Europeísmo"
  },
  { 
    party: "Outros", 
    name: "Deputados Únicos", 
    seats: 36, 
    color: "#808080",
    leader: "Vários",
    founded: "-",
    ideology: "Diversas"
  }
]

// Mock deputy data for general information
const generateDeputies = (): Deputy[] => {
  const deputies: Deputy[] = []
  let deputyId = 1
  
  const constituencies = ["Lisboa", "Porto", "Braga", "Setúbal", "Aveiro", "Coimbra", "Faro", "Leiria", "Santarém", "Viseu"]
  const professions = ["Advogado", "Médico", "Professor", "Engenheiro", "Economista", "Jornalista", "Empresário", "Funcionário Público"]
  const educations = ["Direito", "Medicina", "Engenharia", "Economia", "Ciências Políticas", "Gestão", "Sociologia", "História"]
  const committees = [
    ["Comissão de Assuntos Constitucionais", "Comissão de Educação"],
    ["Comissão de Economia", "Comissão de Finanças"],
    ["Comissão de Saúde", "Comissão de Trabalho"],
    ["Comissão de Ambiente", "Comissão de Agricultura"],
    ["Comissão de Defesa Nacional"]
  ]
  
  parliamentData.forEach(party => {
    for (let i = 0; i < party.seats; i++) {
      const firstName = party.party === "PS" ? "Ana" : party.party === "PSD" ? "João" : party.party === "Chega" ? "Miguel" : "Maria"
      const lastName = `Silva ${deputyId}`
      
      deputies.push({
        id: deputyId++,
        name: `${firstName} ${lastName}`,
        party: party.party,
        partyName: party.name,
        color: party.color,
        constituency: constituencies[Math.floor(Math.random() * constituencies.length)],
        profession: professions[Math.floor(Math.random() * professions.length)],
        education: educations[Math.floor(Math.random() * educations.length)],
        yearsInParliament: Math.floor(Math.random() * 20) + 1,
        age: Math.floor(Math.random() * 30) + 35,
        mandates: Math.floor(Math.random() * 4) + 1,
        committees: committees[Math.floor(Math.random() * committees.length)],
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}@parlamento.pt`,
        phone: `+351 21 391 ${Math.floor(Math.random() * 9000) + 1000}`,
        biography: `Deputado eleito pelo círculo de ${constituencies[Math.floor(Math.random() * constituencies.length)]}, com formação em ${educations[Math.floor(Math.random() * educations.length)]}. Tem uma vasta experiência na área de ${professions[Math.floor(Math.random() * professions.length)].toLowerCase()} e dedica-se particularmente às questões relacionadas com o desenvolvimento social e económico do país.`
      })
    }
  })
  
  return deputies
}

interface Deputy {
  id: number
  name: string
  party: string
  partyName: string
  color: string
  constituency: string
  profession: string
  education: string
  yearsInParliament: number
  age: number
  mandates: number
  committees: string[]
  email: string
  phone: string
  biography: string
}

export default function ParliamentPage() {
  const [selectedDeputy, setSelectedDeputy] = useState<Deputy | null>(null)
  const [selectedParty, setSelectedParty] = useState<typeof parliamentData[0] | null>(null)
  const [deputies] = useState<Deputy[]>(generateDeputies())

  // Convert parliament data to the format expected by parliament-svg
  const parties = useMemo(() => {
    const partiesObject: Record<string, { seats: number; colour: string }> = {}
    
    parliamentData.forEach(party => {
      partiesObject[party.party] = {
        seats: party.seats,
        colour: party.color
      }
    })
    
    return partiesObject
  }, [])

  // Generate SVG using parliament-svg
  const parliamentSvgString = useMemo(() => {
    const virtualSvg = parliamentSVG(parties, { seatCount: false })
    return toSvg(virtualSvg)
  }, [parties])

  // Handle seat clicks
  const handleSeatClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as SVGElement
    if (target.tagName === 'circle') {
      const partyClass = target.getAttribute('class')
      if (partyClass) {
        const partyDeputies = deputies.filter(d => d.party === partyClass)
        if (partyDeputies.length > 0) {
          const randomDeputy = partyDeputies[Math.floor(Math.random() * partyDeputies.length)]
          setSelectedDeputy(randomDeputy)
        }
      }
    }
  }

  const totalSeats = parliamentData.reduce((sum, party) => sum + party.seats, 0)
  const majorityThreshold = Math.floor(totalSeats / 2) + 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]"></div>
        <div className="absolute -right-[5%] top-[10%] h-[250px] w-[250px] rounded-full bg-indigo-600/10 blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[30%] h-[350px] w-[350px] rounded-full bg-purple-600/5 blur-[100px]"></div>
      </div>

      <div className="container relative z-10 mx-auto p-6 pt-24">
        {/* Parliament Information */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center rounded-full bg-[#1a1f36] px-4 py-1.5 text-sm shadow-lg mb-6">
            <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
            Assembleia da República
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Parlamento Português
          </h1>
          <p className="text-lg text-gray-400 mb-6">
            XV Legislatura • 230 Deputados
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Palácio de São Bento, Lisboa</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Mandato: 2022-2026</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Parliament Stats */}
          <div className="space-y-6">
            <div className="card-glass rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Estatísticas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Total de Deputados</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {totalSeats}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Maioria Absoluta</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {majorityThreshold}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Partidos Representados</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {parliamentData.length - 1}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="card-glass rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Informações</h3>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p>A Assembleia da República é o órgão de soberania com competência política e legislativa.</p>
                <p>É composta por 230 deputados eleitos por sufrágio universal, direto e secreto.</p>
                <p>O mandato dos deputados tem a duração de quatro anos.</p>
              </div>
            </div>
          </div>

          {/* Parliament Visualization */}
          <div className="lg:col-span-2">
            <div className="card-glass rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-medium text-white mb-2">Hemiciclo</h2>
                <p className="text-gray-400 text-sm">
                  Clique num lugar para ver informações sobre um deputado
                </p>
              </div>
              <div 
                className="parliament-container cursor-pointer"
                onClick={handleSeatClick}
                dangerouslySetInnerHTML={{ __html: parliamentSvgString }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px'
                }}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Party Distribution */}
            <div className="card-glass rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Composição Partidária</h3>
              <div className="space-y-3">
                {parliamentData.map(party => (
                  <div 
                    key={party.party} 
                    className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded transition-colors"
                    onClick={() => setSelectedParty(party)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="text-sm text-gray-300">{party.party}</span>
                    </div>
                    <Badge className="bg-white/10 text-gray-300 border-white/20">
                      {party.seats}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Party Info */}
            {selectedParty && (
              <div className="card-glass rounded-xl p-6 animate-in">
                <h3 className="text-lg font-medium text-white mb-4">Informações do Partido</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">Nome Completo</label>
                    <p className="text-sm font-medium text-white">{selectedParty.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Líder</label>
                    <p className="text-sm text-gray-300">{selectedParty.leader}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Fundação</label>
                    <p className="text-sm text-gray-300">{selectedParty.founded}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Ideologia</label>
                    <p className="text-sm text-gray-300">{selectedParty.ideology}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Deputados</label>
                    <p className="text-sm text-gray-300">{selectedParty.seats} ({((selectedParty.seats / totalSeats) * 100).toFixed(1)}%)</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedParty(null)}
                    className="w-full mt-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deputy Details Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-[#1a1f36] to-[#0f1629] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            selectedDeputy ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedDeputy && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: selectedDeputy.color }}
                >
                  {selectedDeputy.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedDeputy.name}</h2>
                  <p className="text-sm text-blue-200">{selectedDeputy.partyName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDeputy(null)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Party and Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: selectedDeputy.color }}
                  ></div>
                  <div>
                    <div className="font-semibold text-white">{selectedDeputy.party}</div>
                    <div className="text-sm text-gray-400">{selectedDeputy.constituency}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Idade</div>
                    <div className="font-medium text-white">{selectedDeputy.age} anos</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Mandatos</div>
                    <div className="font-medium text-white">{selectedDeputy.mandates}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10"></div>

              {/* Professional Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Informação Profissional
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Profissão:</span>
                    <span className="ml-2 text-white">{selectedDeputy.profession}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Formação:</span>
                    <span className="ml-2 text-white">{selectedDeputy.education}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10"></div>

              {/* Committees */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Comissões Parlamentares
                </h3>
                <div className="space-y-2">
                  {selectedDeputy.committees.map((committee, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{committee}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10"></div>

              {/* Biography */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-green-400" />
                  Biografia
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedDeputy.biography}</p>
              </div>

              <div className="border-t border-white/10"></div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  Contactos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${selectedDeputy.email}`}
                      className="text-sm text-blue-400 hover:text-blue-300 break-all transition-colors"
                    >
                      {selectedDeputy.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{selectedDeputy.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Histórico de Votações
                </Button>
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Mais Informações
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .parliament-container svg {
          max-width: 100%;
          height: auto;
          filter: brightness(1.2);
        }
        .parliament-container circle {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .parliament-container circle:hover {
          stroke: #60a5fa;
          stroke-width: 2;
          filter: brightness(1.4);
        }
        .parliament-container text {
          fill: #e2e8f0;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
} 