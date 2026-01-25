export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    try {
        const query = getQuery<Query>(event)
        let mostRecent = true
        type Query = {
            dates: string[],
            base: string | undefined,
            currency: string | undefined
        };
        const finalArray: Final[] = []
        type Final = [
            number, string
        ]
        const config = useRuntimeConfig()
        let finalStr = "1 SGD converts to 11,200 IDR"
        type Result = Record<string,Record<string,number>>
        if (query.base != '' && query.currency != '') {
            for (let date of query.dates) {
                try {
                let result = await $fetch<Result>(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${query.base?.toLowerCase() ?? ""}.json`)
                var convertToRate = result[query.base?.toLowerCase() ?? ""][query.currency?.toLowerCase() ?? ""]
                if (mostRecent === true) {
                    finalStr = `1 ${query.base} converts to ${convertToRate.toFixed(2)} ${query.currency}`
                    mostRecent = false
                }
                finalArray.unshift([Number(convertToRate), date])
                } catch (error) {
                    continue
                }
            }
            const rateDelta = ((finalArray[finalArray.length - 1][0] - finalArray[0][0])/finalArray[0][0])*100
            const finalObj = {
                finalArray: finalArray,
                finalStr: finalStr,
                rateDelta: rateDelta,
                collectionArray: null
            }
            return finalObj
        }
        else {
            let finalArray = []
            let finalArrayIndex = 0
            const currencyCollection = await $fetch<Record<string, [string, string]>>(`/api/currency-collection`);
            for (const currency of Object.values(currencyCollection)) {
                let result = await $fetch<Result>(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${query.dates}/v1/currencies/${currency[0].toLowerCase()}.json`)
                var convertToRate = result[currency[0].toLowerCase()][currency[1].toLowerCase()]
                finalArray.push([finalArrayIndex, currency[0], currency[1], `1 ${currency[0]} -> ${convertToRate.toFixed(2)} ${currency[1]}`])
                finalArrayIndex++
            }
            const finalObj = {
                finalArray: null,
                finalStr: null,
                rateDelta: null,
                collectionArray: finalArray
            }
            return finalObj
        }
    } catch(error) {
        console.error("exchange-rate handler crashed:", error)
        throw createError({ statusCode: 500, statusMessage: "exchange-rate failed" })
    }
})