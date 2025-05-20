"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    year: "2009",
    turnout: 59.7,
  },
  {
    year: "2011",
    turnout: 58.1,
  },
  {
    year: "2015",
    turnout: 55.8,
  },
  {
    year: "2019",
    turnout: 48.6,
  },
  {
    year: "2022",
    turnout: 51.4,
  },
]

export function ParticipationChart() {
  return (
    <ChartContainer
      config={{
        turnout: {
          label: "Participação (%)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="turnout" fill="var(--color-turnout)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

