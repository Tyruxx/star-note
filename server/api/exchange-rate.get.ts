export default defineEventHandler(async (event) => {
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
    for (let date of query.dates.slice(1, query.dates.length)) {
        type Result = {
            data: Record<string,RecordValue>
        };
        type RecordValue = {
            value: number
        };
        let result = await $fetch<Result>(`${config.public.exchangeRateApi}/historical?date=${date}&base=${query.base}&currencies=${query.currency}`, {
        headers: {
            apikey: config.exchangeRateApiKey
        }
        })
        let convertToRate = result.data[`${query.currency}`].value
        if (mostRecent === true) {
            finalStr = `1 ${query.base} converts to ${convertToRate.toFixed(4)} ${query.currency}`
            mostRecent = false
        }
        finalArray.unshift([Number(convertToRate), date.slice(5, 10)])
    }
    const rateDelta = ((finalArray[finalArray.length - 1][0] - finalArray[0][0])/finalArray[0][0])*100
    const finalObj = {
        finalArray: finalArray,
        finalStr: finalStr,
        rateDelta: rateDelta
    }
    return finalObj
})