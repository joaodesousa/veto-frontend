"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell } from "lucide-react"

export function LiveUpdatesPanel() {
  const [countedDistricts, setCountedDistricts] = useState(0)
  const [countedVotes, setCountedVotes] = useState(0)
  const [updates, setUpdates] = useState<{ time: string; message: string }[]>([])

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      if (countedDistricts < 20) {
        setCountedDistricts((prev) => prev + 1)
      }

      if (countedVotes < 95) {
        setCountedVotes((prev) => Math.min(prev + Math.random() * 5, 95))
      }

      // Add a new update message
      if (updates.length < 10) {
        const newUpdate = {
          time: new Date().toLocaleTimeString(),
          message: [
            "Distrito de Lisboa: 75% dos votos contados",
            "PS lidera em Setúbal com 34.2%",
            "PSD à frente no Porto com 32.1%",
            "Chega com resultados acima das sondagens em Faro",
            "IL supera expectativas em Lisboa",
            "Participação estimada em 54%, acima das últimas eleições",
            "Primeiras projeções indicam parlamento fragmentado",
            "BE recupera votos em relação a 2022",
            "Livre pode eleger mais deputados que nas últimas eleições",
            "PCP mantém resultados estáveis no Alentejo",
          ][updates.length],
        }
        setUpdates((prev) => [newUpdate, ...prev])
      }
    }, 3000)

    return () => clearInterval(timer)
  }, [countedDistricts, countedVotes, updates.length])

  return (
    <div className="space-y-6">
      <Alert className="bg-red-500 text-white border-none animate-pulse">
        <Bell className="h-4 w-4" />
        <AlertDescription>Resultados em atualização em tempo real</AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Apuramento</CardTitle>
            <CardDescription>Atualizado a cada minuto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Distritos apurados</span>
                  <span className="text-sm font-medium">{countedDistricts}/20</span>
                </div>
                <Progress value={countedDistricts * 5} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Votos contados</span>
                  <span className="text-sm font-medium">{countedVotes.toFixed(1)}%</span>
                </div>
                <Progress value={countedVotes} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resultados Provisórios</CardTitle>
            <CardDescription>Com {countedVotes.toFixed(1)}% dos votos apurados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F8567B]"></div>
                    <span>PS</span>
                  </div>
                  <span className="font-medium">32.4%</span>
                </div>
                <Progress value={32.4} className="h-2 bg-muted" indicatorClassName="bg-[#F8567B]" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF821E]"></div>
                    <span>PSD</span>
                  </div>
                  <span className="font-medium">28.7%</span>
                </div>
                <Progress value={28.7} className="h-2 bg-muted" indicatorClassName="bg-[#FF821E]" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#202056]"></div>
                    <span>CH</span>
                  </div>
                  <span className="font-medium">12.4%</span>
                </div>
                <Progress value={12.4} className="h-2 bg-muted" indicatorClassName="bg-[#202056]" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00AEEF]"></div>
                    <span>IL</span>
                  </div>
                  <span className="font-medium">7.8%</span>
                </div>
                <Progress value={7.8} className="h-2 bg-muted" indicatorClassName="bg-[#00AEEF]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C4161C]"></div>
                    <span>BE</span>
                  </div>
                  <span className="font-medium">5.2%</span>
                </div>
                <Progress value={5.2} className="h-2 bg-muted" indicatorClassName="bg-[#C4161C]" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C4161C]"></div>
                    <span>PCP</span>
                  </div>
                  <span className="font-medium">3.8%</span>
                </div>
                <Progress value={3.8} className="h-2 bg-muted" indicatorClassName="bg-[#C4161C]" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00AA4F]"></div>
                    <span>L</span>
                  </div>
                  <span className="font-medium">3.5%</span>
                </div>
                <Progress value={3.5} className="h-2 bg-muted" indicatorClassName="bg-[#00AA4F]" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#01796F]"></div>
                    <span>PAN</span>
                  </div>
                  <span className="font-medium">1.8%</span>
                </div>
                <Progress value={1.8} className="h-2 bg-muted" indicatorClassName="bg-[#01796F]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Atualizações em Tempo Real</CardTitle>
          <CardDescription>Últimas notícias e resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {updates.map((update, index) => (
              <div key={index} className="flex gap-3 items-start">
                <Badge variant="outline" className="whitespace-nowrap">
                  {update.time}
                </Badge>
                <p className="text-sm">{update.message}</p>
              </div>
            ))}
            {updates.length === 0 && (
              <p className="text-sm text-muted-foreground">Aguardando primeiros resultados...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

