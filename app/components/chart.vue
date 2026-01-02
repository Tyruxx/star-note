<script setup lang="ts">
const props = defineProps<{
    cardTitle: string,
    rateDelta: number,
    chartArray: [number, string][],
}>()
import type {
  ChartConfig,
} from "@/components/ui/chart"

import { LineChart, Sparkles, ChevronRightIcon, BadgeCheckIcon } from 'lucide-vue-next'

// import { Area, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { VisArea, VisAxis, VisLine, VisXYContainer } from "@unovis/vue"

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

const chartData = computed(() => {
    let tempData = []
    for (let [idx, num] of props.chartArray.entries()) {
        const obj = {
            day: idx,
            dayLabel: num[1],
            rate: num[0]
        }
        tempData.push(obj)
        console.log(obj)
    }
    console.log(tempData)
    return tempData
})

// [
//   { day: 1, dayLabel: "17 Dec", rate: 186},
//   { day: 2, dayLabel: "18 Dec", rate: 305 },
//   { day: 3, dayLabel: "19 Dec", rate: 237 },
//   { day: 4, dayLabel: "20 Dec", rate: 73 },
//   { day: 5, dayLabel: "21 Dec", rate: 209 },
//   { day: 6, dayLabel: "22 Dec", rate: 214 },
//   { day: 7, dayLabel: "23 Dec", rate: 214 },
// ]

const yDomain = computed<number[]>(() => {
    const chartDataRate = chartData.value.map(d => d.rate)
    const max = Math.max(...chartDataRate)
    const min = Math.min(...chartDataRate)
    const range = Math.max((max - min))
    const padding = 0.5 * range
    return [min - padding, max + padding];
})

type Data = typeof chartData.value[number]

const chartConfig = {
  rate: {
    label: "Rate",
    color: "rgb(0,0,0)",
  }
} satisfies ChartConfig

const svgDefs = `
  <linearGradient id="fillrate" x1="0" y1="0" x2="0" y2="1">
    <stop
      offset="5%"
      stop-color="var(--color-rate)"
      stop-opacity="0.8"
    />
    <stop
      offset="95%"
      stop-color="var(--color-rate)"
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
const crosshairTemplate = computed(() =>
  componentToString(chartConfig, ChartTooltipContent, { labelKey: "dayLabel" })
)

watchEffect(() => {
  console.log("crosshairTemplate:", crosshairTemplate.value)
})
</script>

<template>
  <Card class="gap-6">
    <CardHeader>
      <CardTitle>{{ cardTitle }}</CardTitle>
      <div class="flex flex-row items-center" v-if="rateDelta < 0">
        <LineChart class="text-red-800"/>
        <span class="text-sm font-semibold text-red-800">{{ rateDelta.toFixed(2) }}%</span>
      </div>
      <div class="flex flex-row items-center" v-if="rateDelta >= 0">
        <LineChart class="text-green-800"/>
        <span class="text-sm font-semibold text-green-800">+{{ rateDelta.toFixed(2) }}%</span>
      </div>
      <CardDescription>
        Rate retrieved on {{ chartData[chartData.length - 1]?.dayLabel }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer :config="chartConfig">
        <VisXYContainer :data="chartData" :svg-defs="svgDefs" :yDomain="yDomain">
          <VisArea
            :x="(d: Data) => d.day"
            :y="[(d: Data) => d.rate]"
            :color="(d: Data, i: number) => ['url(#fillrate)'][i]"
            :opacity="0.4"
          />
          <VisLine
            :x="(d: Data) => d.day"
            :y="[(d: Data) => d.rate]"
            :color="(d: Data, i: number) => [chartConfig.rate.color][i]"
            :line-width="1"
          />
          <VisAxis
            type="x"
            :x="(d: Data) => d.day"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :num-ticks="6"
            :tick-values="chartData.map(d => d.day)"
            :tick-format="(d: number, index: number) => {
              return chartData[index]?.dayLabel.slice(0, 5)
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
            :color="[chartConfig.rate.color]"
          />
        </VisXYContainer>
      </ChartContainer>
    </CardContent>
    <CardFooter>
      <!-- <div class="flex w-full items-start gap-2 text-sm">
        <div class="grid gap-2">
          <div class="flex items-center gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp class="h-4 w-4" />
          </div>
          <div class="text-muted-foreground flex items-center gap-2 leading-none">
            January - June 2024
          </div>
        </div>
      </div> -->
      <div class="flex flex-col w-full gap-6">
        <div class="flex w-full max-w-lg flex-col gap-4 border-1 border-purple-800 p-4 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100">
            <Item variant="default" class="p-2">
            <ItemMedia>
               <Sparkles />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>Upward trend for the next 3 months</ItemTitle>
            </ItemContent>
            </Item>
            <Item variant="outline" size="sm" as-child class="bg-gradient-to-r from-purple-800 to-blue-800 text-white">
                <a href="#">
                    <ItemMedia class="my-auto">
                    <BadgeCheckIcon class="size-5" />
                    </ItemMedia>
                    <ItemContent>
                    <ItemTitle>This is AI generated</ItemTitle>
                    <ItemDescription class="text-white">See AI reasoning</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                    <ChevronRightIcon class="size-4" />
                    </ItemActions>
                </a>
            </Item>
        </div>
        <div class="w-full">
            <Item variant="outline" size="sm" as-child>
                <a href="#">
                    <ItemMedia class="my-auto">
                    <BadgeCheckIcon class="size-5" />
                    </ItemMedia>
                    <ItemContent>
                    <ItemTitle>Final exchange rate shown. No extra fees added later</ItemTitle>
                    <ItemDescription>Learn more</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                    <ChevronRightIcon class="size-4" />
                    </ItemActions>
                </a>
            </Item>
        </div>
    </div>
    </CardFooter>
    </Card>
</template>
