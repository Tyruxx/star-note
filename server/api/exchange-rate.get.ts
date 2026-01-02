export default defineEventHandler(async (event) => {
    // const query = getQuery(event)
    // const config = useRuntimeConfig()
    // const result = await $fetch<Result>(`${config.public.exchangeRateApi}?base=${query.base}&currencies=${query.currency}`, {
    //     headers: {
    //         apikey: config.exchangeRateApiKey
    //     }
    // })
    // type Result = {
    //     data: Record<string,RecordValue>
    // };
    // type RecordValue = {
    //     value: number
    // }

    // const convertToRate = result.data[`${query.currency}`].value.toFixed(2)
    // const finalStr = `1 ${query.base} converts to ${convertToRate} ${query.currency}`
    const finalStr = "1 SGD converts to 11,200 IDR"
    return finalStr
})