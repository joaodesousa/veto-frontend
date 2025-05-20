"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    month: "Set",
    PS: 34.2,
    PSD: 26.5,
    CH: 10.8,
    IL: 6.5,
  },
  {
    month: "Out",
    PS: 33.8,
    PSD: 27.2,
    CH: 11.3,
    IL: 6.8,
  },
  {
    month: "Nov",
    PS: 33.5,
    PSD: 27.8,
    CH: 11.7,
    IL: 7.2,
  },
  {
    month: "Dez",
    PS: 33.0,
    PSD: 28.1,
    CH: 12.0,
    IL: 7.5,
  },
  {
    month: "Jan",
    PS: 32.7,
    PSD: 28.4,
    CH: 12.2,
    IL: 7.6,
  },
  {
    month: "Fev",
    PS: 32.5,
    PSD: 28.7,
    CH: 12.4,
    IL: 7.8,
  },
]

export function PollChart() {
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
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 40]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="PS" stroke="var(--color-PS)" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="PSD" stroke="var(--color-PSD)" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="CH" stroke="var(--color-CH)" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="IL" stroke="var(--color-IL)" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

