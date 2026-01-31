<script setup lang="ts">
import type {
  ChartConfig,
} from '@/components/ui/chart'

import { Spinner } from '@/components/ui/spinner'

import { LineChart, Sparkles, ChevronRightIcon, BadgeCheckIcon } from 'lucide-vue-next'

// import { Area, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue'

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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const props = defineProps<{
  cardTitle: string
  rateDelta: number
  chartArray: [number, string][]
  // aiResult: {
  //     cardTitle: string,
  //     rateDelta: number,
  //     explanationString: string,
  //     chartArray: [number, number, number, string][]
  // } | null
}>()
const aiResult = useState<AiResult>('ai-result')
type AiResult = {
  cardTitle: string
  rateDelta: number
  explanationString: string
  chartArray: [number, number, number, string][]
} | {
  geminiOverload: string
}

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
  for (const [idx, num] of props.chartArray.entries()) {
    const obj = {
      day: idx,
      dayLabel: `${numToMonth[num[1].substring(5, 7)]} ${num[1].substring(8, 10)}`,
      rate: num[0],
    }
    tempData.push(obj)
  }
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
  const range = Math.max((max - min), 0.000001)
  const padding = 0.5 * range
  return [min - padding, max + padding]
})

const xArray = computed<number>(() => {
  const length = props.chartArray.length
  if (length > 8) {
    return Number((length / 10).toFixed(0))
  }
  else {
    return 1
  }
},
)

/** */
type Data = typeof chartData.value[number]

const chartConfig = {
  rate: {
    label: 'Rate',
    color: 'rgb(0,0,0)',
  },
} satisfies ChartConfig

const svgDefs = `
  <linearGradient id="fillrate" x1="0" y1="0" x2="0" y2="1">
    <stop
      offset="5%"
      stop-color="var(--color-rate)"
      stop-opacity="0.3"
    />
    <stop
      offset="95%"
      stop-color="var(--color-rate)"
      stop-opacity="0.3"
    />
  </linearGradient>
  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
    <stop
      offset="5%"
      stop-color="var(--color-mobile)"
      stop-opacity="0.3"
    />
    <stop
      offset="95%"
      stop-color="var(--color-mobile)"
      stop-opacity="0.3"
    />
  </linearGradient>
`
const crosshairTemplate = computed(() =>
  componentToString(chartConfig, ChartTooltipContent, { labelKey: 'dayLabel' }),
)

const chosenRange = useState<number>('range')
function updateRange(number: number) {
  chosenRange.value = number
}
</script>

<template>
  <Card class="gap-6">
    <CardHeader>
      <CardTitle class="text-base">
        {{ cardTitle }}
      </CardTitle>
      <div
        v-if="rateDelta < 0"
        class="flex flex-row items-center gap-1"
      >
        <LineChart class="text-red-800" />
        <span class="text-sm font-semibold text-red-800">{{ rateDelta.toFixed(2) }}%</span>
      </div>
      <div
        v-if="rateDelta >= 0"
        class="flex flex-row items-center gap-1"
      >
        <LineChart class="text-green-800" />
        <span class="text-sm font-semibold text-green-800">+{{ rateDelta.toFixed(2) }}%</span>
      </div>
      <CardDescription>
        Rate retrieved on {{ chartData[chartData.length - 1]?.dayLabel }} UTC
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs :default-value="`${chosenRange}`">
        <TabsList>
          <TabsTrigger
            value="7"
            class="cursor-pointer"
            @click="updateRange(7)"
          >
            7 Days
          </TabsTrigger>
          <TabsTrigger
            value="31"
            class="cursor-pointer"
            @click="updateRange(31)"
          >
            31 Days
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <ChartContainer :config="chartConfig">
        <VisXYContainer
          :data="chartData"
          :svg-defs="svgDefs"
          :y-domain="yDomain"
        >
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
          <ChartTooltip />
          <ChartCrosshair
            :template="componentToString(chartConfig, ChartTooltipContent, { labelKey: 'dayLabel' })"
            :color="[chartConfig.rate.color]"
          />
        </VisXYContainer>
      </ChartContainer>
    </CardContent>
    <CardFooter class="flex flex-col w-full gap-6">
      <div class="flex w-full max-w-lg flex-col gap-4 border-1 border-purple-800 p-4 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100">
        <Item
          variant="default"
          class="p-2"
        >
          <ItemMedia>
            <Sparkles v-if="aiResult !== null" />
            <Spinner v-else />
          </ItemMedia>
          <ItemContent>
            <ItemTitle
              v-if="aiResult != null && !(`geminiOverload` in aiResult)"
              class="text-base"
            >
              {{ aiResult.cardTitle }}
            </ItemTitle>
            <ItemTitle
              v-else-if="aiResult != null && !(`cardTitle` in aiResult)"
              class="text-base"
            >
              {{ aiResult.geminiOverload }}
            </ItemTitle>
            <ItemTitle
              v-else
              class="text-base"
            >
              Loading AI prediction...
            </ItemTitle>
          </ItemContent>
        </Item>
        <Item
          variant="outline"
          size="sm"
          as-child
          class="bg-gradient-to-r from-purple-800 to-blue-800 text-white"
        >
          <NuxtLink
            v-if="aiResult != null && !(`geminiOverload` in aiResult)"
            to="ai-reasoning"
          >
            <ItemMedia class="my-auto">
              <BadgeCheckIcon class="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>This is AI generated</ItemTitle>
              <ItemDescription class="text-white">See full AI analysis</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon class="size-4" />
            </ItemActions>
          </NuxtLink>
        </Item>
      </div>
      <div class="w-full">
        <Item
          variant="outline"
          size="sm"
          as-child
        >
          <NuxtLink to="additional-fee">
            <ItemMedia class="my-auto">
              <BadgeCheckIcon class="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Final exchange rate is shown. No additional fees</ItemTitle>
              <ItemDescription>Learn more</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon class="size-4" />
            </ItemActions>
          </NuxtLink>
        </Item>
      </div>
    <!-- </div> -->
    </CardFooter>
  </Card>
</template>
