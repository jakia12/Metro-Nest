import { getChatCompletion } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { propertyPrice, downPayment, interestRate, loanTerm } = await request.json();

    // Validate inputs
    if (!propertyPrice || !downPayment || !interestRate || !loanTerm) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Calculate mortgage
    const principal = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    const downPaymentPercent = ((downPayment / propertyPrice) * 100).toFixed(1);

    // Get AI insights from Gemini
    const prompt = `As a mortgage advisor, provide brief insights for this mortgage scenario:

Property Price: $${propertyPrice.toLocaleString()}
Down Payment: $${downPayment.toLocaleString()} (${downPaymentPercent}%)
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} years
Monthly Payment: $${monthlyPayment.toFixed(2).toLocaleString()}
Total Interest: $${totalInterest.toFixed(2).toLocaleString()}

Provide exactly 3 key insights and 1 recommendation. Consider:
- Down payment percentage impact
- Interest rate considerations
- Loan term trade-offs
- Affordability based on typical income ratios

Return ONLY valid JSON in this exact format:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendation": "brief recommendation (1-2 sentences)",
  "affordabilityScore": "High or Medium or Low"
}

Be concise and practical. No additional text outside the JSON.`;

    const aiResponse = await getChatCompletion([
      { role: 'user', content: prompt }
    ]);

    // Parse AI response
    let aiInsights = {};
    try {
      const cleanedResponse = aiResponse.replace(/```json|```/g, '').trim();
      aiInsights = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback insights if AI fails
      aiInsights = {
        insights: [
          `Your ${downPaymentPercent}% down payment ${parseFloat(downPaymentPercent) >= 20 ? 'avoids PMI costs' : 'may require PMI insurance'}`,
          `At ${interestRate}% interest, you'll pay $${Math.round(totalInterest).toLocaleString()} in total interest`,
          `A ${loanTerm}-year term balances monthly affordability with total cost`
        ],
        recommendation: "This mortgage structure appears reasonable. Consider consulting a financial advisor for personalized guidance based on your complete financial picture.",
        affordabilityScore: parseFloat(downPaymentPercent) >= 20 ? "High" : parseFloat(downPaymentPercent) >= 10 ? "Medium" : "Low"
      };
    }

    return NextResponse.json({
      success: true,
      calculation: {
        propertyPrice,
        downPayment,
        loanAmount: principal,
        interestRate,
        loanTerm,
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        downPaymentPercentage: downPaymentPercent
      },
      aiInsights
    });

  } catch (error) {
    console.error('Mortgage Calculator Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate mortgage. Please try again.' 
      },
      { status: 500 }
    );
  }
}