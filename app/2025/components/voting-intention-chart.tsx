"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "PS", value: 32.5, color: "#F8567B" },
  { name: "PSD", value: 28.7, color: "#FF821E" },
  { name: "CH", value: 12.4, color: "#202056" },
  { name: "IL", value: 7.8, color: "#00AEEF" },
  { name: "BE", value: 5.2, color: "#C4161C" },
  { name: "PCP", value: 3.8, color: "#C4161C" },
  { name: "L", value: 3.5, color: "#00AA4F" },
  { name: "PAN", value: 1.8, color: "#01796F" },
  { name: "Outros", value: 4.3, color: "#888888" },
]

export function VotingIntentionChart() {
  return (
    <ChartContainer
      config={{
        PS: {
          label: "PS",
          color: "#F8567B",
        },
        PSD: {
          label: "PSD",
          color: "#FF821E",
        },
        CH: {
          label: "CH",
          color: "#202056",
        },
        IL: {
          label: "IL",
          color: "#00AEEF",
        },
        BE: {
          label: "BE",
          color: "#C4161C",
        },
        PCP: {
          label: "PCP",
          color: "#C4161C",
        },
        L: {
          label: "L",
          color: "#00AA4F",
        },
        PAN: {
          label: "PAN",
          color: "#01796F",
        },
        Outros: {
          label: "Outros",
          color: "#888888",
        },
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

