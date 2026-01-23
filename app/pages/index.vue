<script lang="ts" setup>
    const { account } = useAppwrite()
    try {
        const session = await account.get()
        console.log(session)
    }
    catch (error) {
        console.log(error)
        navigateTo('/login')
    }
    async function appwriteDeleteSessions() {
        await account.deleteSessions();
        navigateTo('/login')
    }
    import { ChevronLeft } from 'lucide-vue-next'
    import { Button } from '@/components/ui/button'
    import { Spinner } from '@/components/ui/spinner'
    const stateConvertFrom = useState("convert-from", () => "")
    const stateConvertTo = useState("convert-to", () => "")
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
    function getPastDates(range: number, offsetDays: number): string[] {
        const result: string[] = []

        const today = new Date()

        const start = new Date(Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate() - offsetDays
        ))

        for (let i = 0; i < range; i+=1) {
            const d = new Date(start)
            d.setUTCDate(start.getUTCDate() - i)

            const yyyy = d.getUTCFullYear()
            const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
            const dd = String(d.getUTCDate()).padStart(2, "0")

            result.push(`${yyyy}-${mm}-${dd}`)
        }

        return result
    }
    type testStrType = {
    finalArray: [number, string][],
    finalStr: string,
    rateDelta: number,
    collectionArray: [number, string, string, string][]
    }

    type aiResultType = {
        cardTitle: string,
        rateDelta: number,
        explanationString: string,
        chartArray: [number, number, number, string][]
    }


    const testStr = useState<testStrType | null>("past-data", () => null)
    const loading = ref(false)
    const fetchError = ref<unknown>(null)
    const aiResult = useState<aiResultType | null>("ai-result", () => null)

    let range = useState<number>("range", () => 7)
    const maxRetries = 10 // safety cap so don't loop forever

    async function fetchWithRetries() {
    loading.value = true
    fetchError.value = null
    testStr.value = null

    for (let offsetDays = 0; offsetDays < maxRetries; offsetDays++) {
        const dates = getPastDates(range.value, offsetDays)
        const stateDate = useState("dates", () => dates);
        try {
            var data = await $fetch<testStrType>("/api/exchange-rate", {
            query: {
                base: convertFrom.value,
                currency: convertTo.value,
                dates,
            },
            })
        } catch (err) {
            continue
        }
        const payload = data as any
        if (payload && "errors" in payload) {
        continue
        }

        testStr.value = data ?? null
        loading.value = false
        return
    }

    fetchError.value = new Error("Failed after retries")
    loading.value = false
    }


    watch([convertFrom, convertTo, range], async (_, __, onCleanup) => {
        const controller = new AbortController()
        onCleanup(() => controller.abort())
        aiResult.value = null
        if (stateConvertFrom.value !== '' && stateConvertTo.value !== '')
            {
                if (range.value == 1) {
                    range.value = 7
                }
                await fetchWithRetries()
                
                // gemini ai api setup
                async function callGemini() {
                    console.log("start")
                    console.log(testStr.value)
                    const response = await $fetch<string>('/api/gemini', {
                        method: 'POST',
                        body: {
                            pastData: testStr.value,
                            base: stateConvertFrom.value,
                            currency: stateConvertTo.value
                        },
                        signal: controller.signal
                    })
                    return response
                }
                const response = await callGemini()
                // gemini ai response
                aiResult.value = JSON.parse(response)
            }
        else {
            if (stateConvertFrom.value == '' || stateConvertTo.value == '') {
                range.value = 1
                await fetchWithRetries()
            }
        }
    }, { immediate: true })
</script>
<template>
    <div class="mx-auto px-8 py-8 flex flex-col min-h-screen gap-4 max-w-lg">
        <div class="flex flex-row gap-4">
            <Button variant="secondary">
                Demo
            </Button>
            <Button class="cursor-pointer" @click="appwriteDeleteSessions">
                Logout
            </Button>
        </div>
        <div class="w-fit text-5xl font-semibold">Convert</div>
        <div>
            <Conversion :country-from-img="countryFromImg" :country-to-img="countryToImg" :country-from-str="countryFromStr" :country-to-str="countryToStr" :country-from-fallback="countryFromFallback" :country-to-fallback="countryToFallback"/>
        </div>
        <div v-if="stateConvertFrom !== '' && stateConvertTo !== '' ">
            <Chart :card-title="testStr?.finalStr ?? ''" :rate-delta="testStr?.rateDelta ?? 0" :chart-array="testStr?.finalArray ?? []" v-if="testStr !== null"/>
            <Button disabled v-else>
                <Spinner />
                Loading
            </Button>
        </div>
        <div v-else class="flex flex-col flex-1">
            <RateCollection :final-array="testStr?.collectionArray ?? []" :convert-from="convertFrom" :convert-to="convertTo" v-if="testStr !== null"/>
            <Button disabled v-else class="w-fit">
                <Spinner />
                Loading
            </Button>            
        </div>
    </div>
</template>