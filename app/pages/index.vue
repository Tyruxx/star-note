<script lang="ts" setup>
    import { ChevronLeft } from 'lucide-vue-next'
    import { Button } from '@/components/ui/button'
    const stateConvertFrom = useState("convert-from", () => "IDR")
    const stateConvertTo = useState("convert-to", () => "SGD")
    const convertFrom = computed(() => stateConvertFrom.value)
    const convertTo = computed(() => stateConvertTo.value)
    const { data: countryFrom } = await useFetch<Country[]>(() => `https://restcountries.com/v3.1/currency/${convertFrom.value}`, { watch: [convertFrom] })
    const { data: countryTo } = await useFetch<Country[]>(() => `https://restcountries.com/v3.1/currency/${convertTo.value}`, { watch: [convertTo] })
    const { data: tempStr } = await useFetch<CurrencyMap>(`/api/currency-list`)
    type Country = {
        flags: {
            png: string
        },
        name: {
            common: string
        },
        cca2: string
    };
    type CurrencyMap = Record<string, string>;

    // conversion props and logic
    function getCountryImg(from: boolean, convertFromTo?: Country[]) {
        if (((convertFromTo)?.length ?? 0) > 1) {
            if  (
                (from === true && convertFrom.value === "EUR") ||
                (from === false && convertTo.value === "EUR")
                ) { return "https://flagcdn.com/w320/eu.png" }
            if  (
                (from === true && convertFrom.value === "USD") ||
                (from === false && convertTo.value === "USD")
                ) { return "https://flagcdn.com/w320/us.png" }
        }
        return convertFromTo?.[0]?.flags.png
    }
    const countryFromImg = computed(() => {
        return getCountryImg(true, countryFrom.value) ?? ""
    })
    const countryToImg = computed(() => {
        return getCountryImg(false, countryTo.value) ?? ""
    })
    const countryFromStr = computed(() => {
        return tempStr.value?.[`${convertFrom.value}`] ?? ""
    })
    const countryToStr = computed(() => {
        return tempStr.value?.[`${convertTo.value}`] ?? ""
    })
    const countryFromFallback = convertFrom
    const countryToFallback = convertTo

    // chart props and logic
    function getPastDates(range: number): string[] {
        const result: string[] = []

        const today = new Date()
        const start = new Date(Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
        ))

        for (let i = 0; i < range; i++) {
            const d = new Date(start)
            d.setUTCDate(start.getUTCDate() - i)

            const yyyy = d.getUTCFullYear()
            const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
            const dd = String(d.getUTCDate()).padStart(2, "0")

            result.push(`${yyyy}-${mm}-${dd}`)
        }

        return result
    }
    const range = 7
    const resultGetPastDates = computed(() => {
        return getPastDates(range)
    })
    const { data: testStr } = await useFetch<testStrType>('/api/exchange-rate', {
        query: {
            base: convertFrom,
            currency: convertTo,
            dates: resultGetPastDates
        },
        watch: [convertFrom, convertTo, resultGetPastDates]
    })
    type testStrType = {
        finalArray: [number, string][],
        finalStr: string,
        rateDelta: number,
    };
    console.log("api test")
    console.log(testStr.value)
</script>
<template>
    <div class="mx-auto px-8 py-8 flex h-screen flex-col gap-4 max-w-lg">
        <div>
            <Button variant="secondary" size="icon">
                <ChevronLeft />
            </Button>
        </div>
        <div class="mx-auto w-fit text-4xl font-semibold">Convert</div>
        <div>
            <Conversion :country-from-img="countryFromImg" :country-to-img="countryToImg" :country-from-str="countryFromStr" :country-to-str="countryToStr" :country-from-fallback="countryFromFallback" :country-to-fallback="countryToFallback"/>
        </div>
        <div>
            <Chart :card-title="testStr?.finalStr ?? ''" :rate-delta="testStr?.rateDelta ?? 0" :chart-array="testStr?.finalArray ?? []"/>
        </div>
    </div>
</template>