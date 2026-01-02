<script setup lang="ts">
defineProps<{
    cardTitle: string,
    rateDelta: number
}>()
import type {
  ChartConfig,
} from "@/components/ui/chart"

import { LineChart } from 'lucide-vue-next'

// import { Area, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { VisArea, VisAxis, VisLine, VisXYContainer } from "@unovis/vue"

import { TrendingUp } from "lucide-vue-next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartCrosshair,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart"

const description = "An area chart with axes"

const chartData = [
  { day: 1, dayLabel: "17 Dec", desktop: 186},
  { day: 2, dayLabel: "18 Dec", desktop: 305 },
  { day: 3, dayLabel: "19 Dec", desktop: 237 },
  { day: 4, dayLabel: "20 Dec", desktop: 73 },
  { day: 5, dayLabel: "21 Dec", desktop: 209 },
  { day: 6, dayLabel: "22 Dec", desktop: 214 },
  { day: 7, dayLabel: "23 Dec", desktop: 214 },
]

type Data = typeof chartData[number]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "rgb(0,0,0)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const svgDefs = `
  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
    <stop
      offset="5%"
      stop-color="var(--color-desktop)"
      stop-opacity="0.8"
    />
    <stop
      offset="95%"
      stop-color="var(--color-desktop)"
      stop-opacity="0.1"
    />
  </linearGradient>
  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
    <stop
      offset="5%"
      stop-color="var(--color-mobile)"
      stop-opacity="0.8"
    />
    <stop
      offset="95%"
      stop-color="var(--color-mobile)"
      stop-opacity="0.1"
    />
  </linearGradient>
`
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ cardTitle }}</CardTitle>
      <div class="flex flex-row items-center" v-if="rateDelta < 0">
        <LineChart class="text-red-800"/>
        <span class="text-sm font-semibold text-red-800">{{ rateDelta }}%</span>
      </div>
      <div class="flex flex-row items-center" v-if="rateDelta >= 0">
        <LineChart class="text-green-800"/>
        <span class="text-sm font-semibold text-green-800">{{ rateDelta }}%</span>
      </div>
      <CardDescription>
        Last updated just now
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer :config="chartConfig">
        <VisXYContainer :data="chartData" :svg-defs="svgDefs">
          <VisArea
            :x="(d: Data) => d.day"
            :y="[(d: Data) => d.desktop]"
            :color="(d: Data, i: number) => ['url(#fillDesktop)'][i]"
            :opacity="0.4"
          />
          <VisLine
            :x="(d: Data) => d.day"
            :y="[(d: Data) => d.desktop]"
            :color="(d: Data, i: number) => [chartConfig.desktop.color][i]"
            :line-width="1"
          />
          <VisAxis
            type="x"
            :x="(d: Data) => d.day"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :num-ticks="6"
            :tick-format="(d: number, index: number) => {
              return chartData[index]?.dayLabel.slice(0, 6)
            }"
          />
          <VisAxis
            type="y"
            :num-ticks="3"
            :tick-line="false"
            :domain-line="false"
            :tick-format="(d: number, index: number) => ''"
          />
          <ChartTooltip />
          <ChartCrosshair
            :template="componentToString(chartConfig, ChartTooltipContent, { labelKey: 'dayLabel' })"
            :color="(d: Data, i: number) => [chartConfig.desktop.color][i % 2]"
          />
        </VisXYContainer>
      </ChartContainer>
    </CardContent>
    <CardFooter>
      <div class="flex w-full items-start gap-2 text-sm">
        <div class="grid gap-2">
          <div class="flex items-center gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp class="h-4 w-4" />
          </div>
          <div class="text-muted-foreground flex items-center gap-2 leading-none">
            January - June 2024
          </div>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
