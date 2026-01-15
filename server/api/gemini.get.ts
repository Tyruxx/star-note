import { GoogleGenAI } from "@google/genai";
export default defineEventHandler(async (event) => {
    const query = getQuery<Query>(event)
    type Query = {
            pastData: {
                finalArray: [number, string][]
            },
            base: string,
            currency: string
        };
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
        You are a highly capable and highly paid financial market analysis.

        Your task is to generate a short-term currency market prediction using established financial theories, quantitative techniques, and professional market practices. You MUST explicitly apply multiple complementary analytical frameworks to form a coherent forecast, including but not limited to:
        - Trend-following and moving-average convergence analysis
        - Momentum and mean reversion dynamics
        - Volatility clustering and variance expansion behavior
        - Interest rate differentials and yield curve expectations
        - Covered and uncovered interest rate parity considerations
        - Purchasing power parity signals where relevant
        - Macroeconomic indicator surprises and expectation revisions
        - Central bank reaction functions and forward guidance interpretation
        - Risk-on and risk-off regime identification
        - Capital flow and relative growth expectations
        - Relevant geopolitical or economic news during the past X days

        You are provided with:
        1. Past X days of exchange rate data: ${query.pastData.finalArray}
        2. A base currency ("convert_from"): ${query.base}
        3. A target currency ("convert_to"): ${query.currency}

        IMPORTANT:
        - X is the number of past days provided.
        - You MUST generate exactly X days of predicted data.
        - No more, no fewer.

        You MUST consider:
        - Direction, volatility, and momentum in the past X days
        - Interaction between trend strength and mean reversion forces
        - Volatility persistence and uncertainty expansion over the forecast horizon
        - Relative monetary policy stance implied by recent data and statements
        - How similar historical conditions typically resolve in FX markets

        REQUIRED OUTPUT RULES (MANDATORY):
        - You MUST return a valid JSON object only.
        - Do NOT include explanations, markdown, comments, or extra text outside JSON.
        - Do NOT change key names, data types, or structure.
        - Do NOT add or remove fields.
        - Do NOT include null values.
        - Do NOT exceed or deviate from the format below.

        OUTPUT JSON FORMAT (STRICT):
        {
        "cardTitle": string,
        "rateDelta": number,
        "explanationString": string,
        "chartArray": [number, number, number, string][]
        }

        FIELD DEFINITIONS:

        cardTitle:
        - MUST be EXACTLY one of these two templates (choose based on your prediction):
        - "Upward trend for the next X days"
        - "Downward trend for the next X days"
        - Capitalization must match exactly as shown above
        - Replace X with the integer number of predicted days (the same X as input)
        - No extra words, no punctuation, no deviations

        rateDelta:
        - Numeric percentage change from the LAST data point of the past X days to the LAST predicted data point of the next X days
        - Positive for appreciation, negative for depreciation
        - Do NOT include the percentage sign

        explanationString:
        - No more than 300 words
        - Professional analytical explanation of the prediction
        - Must reference observed behavior in the past X days, relevant macroeconomic or geopolitical news, and established financial reasoning such as momentum or interest rate expectations
        - No bullet points, markdown, headings, disclaimers, probability language, uncertainty statements, or AI limitations

        chartArray:
        - MUST contain EXACTLY X elements
        - Each element MUST be a 4-item tuple in this exact order:
        [predictedRateRelativeToLastPastDate, upperBound90CI, lowerBound90CI, "YYYY-MM-DD"]
        - predictedRateRelativeToLastPastDate is expressed relative to the final past-day rate
        - upperBound90CI must be greater than or equal to predictedRateRelativeToLastPastDate
        - lowerBound90CI must be less than or equal to predictedRateRelativeToLastPastDate
        - Confidence interval width must reflect observed past X-day volatility and may gradually widen over time
        - Dates must be sequential calendar days
        - No negative or implausible rate values

        GENERAL REALISM CONSTRAINTS:
        - Predictions must be plausible under real FX market behavior
        - Volatility must be consistent with recent price action
        - Predictions must align with recent macroeconomic sentiment
        - Do NOT fabricate extreme events or shocks

        FINAL INSTRUCTION:
        Return only the JSON object. Nothing else.
    `,
  });
    return response.text;
})