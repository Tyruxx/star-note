<script lang="ts" setup>
    definePageMeta({
        middleware: ['auth'],
    })
    type aiResultType = {
        cardTitle: string,
        rateDelta: number,
        explanationString: string,
        chartArray: [number, number, number, string][]
    }
    type testStrType = {
        finalArray: [number, string][],
        finalStr: string,
        rateDelta: number,
    }
    const aiResultState = useState<aiResultType | null>("ai-result")
    const pastData = useState<testStrType | null>("past-data")
    import { Sparkles, LineChart } from 'lucide-vue-next'
    const numToMonth: Record<string, string> = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    }
</script>
<template>
    <div class="mx-auto px-8 py-8 flex flex-col gap-4 max-w-lg">
        <div>
            <Button variant="secondary">
                Demo
            </Button>
        </div>
        <div class="w-fit text-5xl font-semibold">AI Analysis</div>
        <div class="flex w-full max-w-lg flex-col gap-4">
            <Item variant="default" class="p-2">
            <ItemMedia>
            <Sparkles />
            </ItemMedia>
            <ItemContent>
                <ItemTitle class="text-base">{{ aiResultState?.cardTitle }}</ItemTitle>
                <div class="flex flex-row items-center gap-1" v-if="aiResultState?.rateDelta !== undefined && aiResultState?.rateDelta < 0">
                    <LineChart class="text-red-800"/>
                    <span class="text-sm font-semibold text-red-800 gap-3">{{ aiResultState?.rateDelta.toFixed(2) }}% from {{ numToMonth[(pastData?.finalArray[pastData?.finalArray.length - 1]?.[1].substring(5,7)) ?? ""] }} {{ pastData?.finalArray[pastData?.finalArray.length - 1]?.[1].substring(8,10) }} UTC to {{ aiResultState.chartArray?.[aiResultState.chartArray?.length - 1]?.[3].substring(5,11) }} UTC</span>
                </div>
                <div class="flex flex-row items-center gap-1" v-if="aiResultState?.rateDelta !== undefined && aiResultState?.rateDelta >= 0">
                    <LineChart class="text-green-800"/>
                    <span class="text-sm font-semibold text-green-800">+{{ aiResultState?.rateDelta.toFixed(2) }}% from {{ numToMonth[(pastData?.finalArray[pastData?.finalArray.length - 1]?.[1].substring(5,7)) ?? ""] }} {{ pastData?.finalArray[pastData?.finalArray.length - 1]?.[1].substring(8,10) }} UTC to {{ aiResultState.chartArray?.[aiResultState.chartArray?.length - 1]?.[3].substring(5,11) }} UTC</span>
                </div>
            </ItemContent>
            </Item>
            <div class="p-2">
                <ChartReasoning :card-title="aiResultState.cardTitle" :rate-delta="aiResultState.rateDelta" :chart-array="aiResultState.chartArray" :past-data="pastData.finalArray" v-if="aiResultState !== null && pastData !== null"/>
            </div>
        </div>
            <div class="flex w-full max-w-lg flex-col gap-4 border-1 border-purple-800 p-4 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100">
                <Item variant="default" class="p-2">
                    <div class="text-base font-semibold">AI Explanation</div>
                    <div class="text-base">{{ aiResultState?.explanationString }}</div>
                </Item>
            </div>
        <div>
            <NuxtLink to="/"><Button class="w-full cursor-pointer">Back</Button></NuxtLink>
        </div>
    </div>
</template>