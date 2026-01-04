export default defineEventHandler(async (event) => {
    try {
        const query = getQuery<Query>(event)
        let mostRecent = true
        type Query = {
            dates: string[],
            base: string,
            currency: string
        };
        const finalArray: Final[] = []
        type Final = [
            number, string
        ]
        const config = useRuntimeConfig()
        let finalStr = "1 SGD converts to 11,200 IDR"
        for (let date of query.dates) {
            try {
            type Result = Record<string,Record<string,number>>
            let result = await $fetch<Result>(`${config.public.exchangeRateApi}${date}/v1/currencies/${query.base.toLowerCase()}.json`, {
            headers: {
                apikey: config.exchangeRateApiKey
            }
            })
            var convertToRate = result[query.base.toLowerCase()][query.currency.toLowerCase()]
            if (mostRecent === true) {
                finalStr = `1 ${query.base} converts to ${convertToRate.toFixed(4)} ${query.currency}`
                mostRecent = false
            }
            finalArray.unshift([Number(convertToRate), date.slice(5, 10)])
            } catch (error) {
                continue
            }
        }
        const rateDelta = ((finalArray[finalArray.length - 1][0] - finalArray[0][0])/finalArray[0][0])*100
        const finalObj = {
            finalArray: finalArray,
            finalStr: finalStr,
            rateDelta: rateDelta
        }
        return finalObj
    } catch(error) {
        console.error("exchange-rate handler crashed:", error)
        throw createError({ statusCode: 500, statusMessage: "exchange-rate failed" })
    }
})