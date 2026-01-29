<script setup lang="ts">
import type {
  ChartConfig,
} from '@/components/ui/chart'

import { LineChart, Sparkles, ChevronRightIcon, BadgeCheckIcon } from 'lucide-vue-next'

// import { Area, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { VisArea, VisAxis, VisLine, VisXYContainer, VisPlotband } from '@unovis/vue'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartCrosshair,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'

const props = defineProps<{
  cardTitle: string
  rateDelta: number
  pastData: [number, string][]
  chartArray: [number, number, number, string][]
}>()

const description = 'An area chart with axes'

const numToMonth: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

const chartData = computed(() => {
  const tempData = []
  let index = 0
  for (const pastNum of props.pastData) {
    const obj = {
      day: index,
      dayLabel: `${numToMonth[pastNum[1].substring(5, 7)]} ${pastNum[1].substring(8, 10)}`,
      predictedRate: pastNum[0] ?? 0,
    }
    index++
    tempData.push(obj)
  }
  for (const num of props.chartArray) {
    const obj = {
      day: index,
      dayLabel: num[3].substring(5, 11),
      predictedRate: num[0],
    }
    index++
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
  const chartDataRate = chartData.value.map(d => d.predictedRate)
  const max = Math.max(...chartDataRate)
  const min = Math.min(...chartDataRate)
  const range = Math.max((max - min), 0.000001)
  const padding = 0.5 * range
  return [min - padding, max + padding]
})

const xArray = computed<number>(() => {
  const length = chartData.value.length
  if (length > 8) {
    return Number((length / 10).toFixed(0))
  }
  else {
    return 1
  }
},
)

type Data = typeof chartData.value[number]

const chartConfig = {
  predictedRate: {
    label: 'Rate',
    color: 'rgb(0,0,0)',
  },
} satisfies ChartConfig

const svgDefs = `
  <linearGradient id="aigradient" x1="0" y1="0" x2="1" y2="0">
    <stop
      offset="5%"
      stop-color="rgb(107, 33, 168)"
      stop-opacity="0.1"
    />
    <stop
      offset="95%"
      stop-color="rgb(30, 64, 175)"
      stop-opacity="0.1"
    />
  </linearGradient>
  <linearGradient id="fillpredictedrate" x1="0" y1="0" x2="0" y2="1">
    <stop
      offset="5%"
      stop-color="rgb(0,0,0)"
      stop-opacity="0.3"
    />
    <stop
      offset="95%"
      stop-color="rgb(0,0,0)"
      stop-opacity="0.3"
    />
  </linearGradient>
`
const upperLower = computed(() => {
  const tempObj: Record<string, [number, number]> = {}
  for (const x of props.chartArray) {
    tempObj[x[3].substring(5, 11)] = [x[1], x[2]]
  }
  return tempObj
})

const payloadTemp = computed(() => {
  const tempObj: Record<string, number> = {}
  for (const x of chartData.value) {
    tempObj[x.dayLabel] = x.predictedRate
  }
  return tempObj
})
const crosshairTemplate = computed(() => {
  return componentToString(chartConfig, ChartTooltipContent, { labelKey: 'dayLabel', payload: payloadTemp.value, upperLower: upperLower.value })
},
)

watchEffect(() => {
  console.log('crosshairTemplate:', crosshairTemplate.value)
})
</script>

<template>
  <ChartContainer :config="chartConfig">
    <VisXYContainer
      :data="chartData"
      :svg-defs="svgDefs"
      :y-domain="yDomain"
    >
      <VisArea
        :x="(d: Data) => d.day"
        :y="[(d: Data) => d.predictedRate]"
        :color="(d: Data, i: number) => ['url(#fillpredictedrate)'][i]"
        :opacity="0.4"
      />
      <VisLine
        :x="(d: Data) => d.day"
        :y="[(d: Data) => d.predictedRate]"
        :color="(d: Data, i: number) => [chartConfig.predictedRate.color][i]"
        :line-width="1"
      />
      <VisAxis
        type="x"
        :x="(d: Data) => d.day"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :tick-values="chartData.map(d => d.day)"
        :tick-format="(d: string, index: number) => {
          d = chartData[index]?.dayLabel.slice(0, 6) ?? ''
          return (index) % xArray == 0 ? d: ''
        }"
      />
      <VisAxis
        type="y"
        :num-ticks="3"
        :tick-line="false"
        :domain-line="false"
        :tick-format="(d: number, index: number) => ''"
      />
      <VisPlotband
        :from="((chartData.length)/2).toFixed(0)"
        :to="((chartData.length)).toFixed(0)"
        color="url(#aigradient)"
        axis="x"
      />
      <ChartTooltip />
      <ChartCrosshair
        :template="crosshairTemplate"
        :color="(d: Data, i: number) => [chartConfig.predictedRate.color]"
      />
    </VisXYContainer>
  </ChartContainer>
</template>
