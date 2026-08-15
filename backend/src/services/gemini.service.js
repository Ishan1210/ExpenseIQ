const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Builds a compact summary of the user's expenses (grouped by category)
 * and income, then asks Gemini for spending insights + suggestions.
 * We send aggregated numbers, not raw rows — smaller prompt, cheaper, faster.
 */
async function generateInsights({ expenses, income, budgets, goals }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);

  const prompt = `You are a personal finance assistant. Analyze this user's monthly financial snapshot and respond with ONLY a JSON object, no markdown, no preamble, in this exact shape:
{
  "summary": "one paragraph overview of their spending health",
  "insights": ["short insight 1", "short insight 2", "short insight 3"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
  "riskFlags": ["any concerning pattern, or empty array if none"]
}

Financial data:
- Total income: ${totalIncome}
- Total spent: ${totalSpent}
- Spending by category: ${JSON.stringify(categoryTotals)}
- Active budgets: ${JSON.stringify(budgets.map((b) => ({ category: b.category, limit: b.limit })))}
- Savings goals: ${JSON.stringify(goals.map((g) => ({ title: g.title, target: g.targetAmount, saved: g.savedAmount })))}

Keep insights specific to the numbers above, concise, and practical. Respond with raw JSON only.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Gemini sometimes wraps JSON in ```json fences despite instructions — strip if present
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', text);
    throw new Error('AI response was not valid JSON');
  }
}

module.exports = { generateInsights };
