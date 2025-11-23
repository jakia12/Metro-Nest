

import MortgageCalculator from "@/components/shared/MortgageCalculator";


export const metadata = {
  title: 'AI Mortgage Calculator | Real Estate',
  description: 'Calculate your mortgage with AI-powered insights and smart recommendations'
};

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mortgage Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant mortgage calculations with AI-powered insights to help you make informed decisions about your home purchase
          </p>
        </div>

        {/* Calculator */}
        <MortgageCalculator />

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
            <p className="text-sm text-gray-600">
              Get precise monthly payment estimates based on current market rates and your specific situation
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-gray-600">
              Receive personalized recommendations and insights powered by advanced AI technology
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Comparisons</h3>
            <p className="text-sm text-gray-600">
              Compare different loan terms and down payments to find the best option for your budget
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How Our AI Mortgage Calculator Works
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Enter Your Details</h3>
                <p className="text-sm text-gray-600">
                  Input the property price, down payment amount, interest rate, and desired loan term
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our AI analyzes your inputs and compares them against market data and best practices
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Smart Insights</h3>
                <p className="text-sm text-gray-600">
                  Receive personalized insights, affordability scores, and recommendations to guide your decision
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 py-3">
                What is included in the monthly payment?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-600 pl-4 pb-3">
                The calculated monthly payment includes principal and interest only. It does NOT include property taxes, homeowner's insurance, HOA fees, or PMI (Private Mortgage Insurance). Your actual payment will be higher.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 py-3">
                How accurate are these calculations?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-600 pl-4 pb-3">
                Our calculator uses standard mortgage formulas and is quite accurate for estimates. However, actual rates and terms may vary based on your credit score, lender, and market conditions. Always consult with a mortgage professional for exact figures.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 py-3">
                What's a good down payment percentage?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-600 pl-4 pb-3">
                20% is ideal as it typically avoids PMI (Private Mortgage Insurance) and gets better interest rates. However, many buyers put down 3-10% with FHA or conventional loans. Our AI will provide guidance based on your specific situation.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 py-3">
                Should I choose 15, 20, or 30 year term?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-600 pl-4 pb-3">
                30-year loans have lower monthly payments but more total interest. 15-year loans build equity faster and pay less interest overall, but have higher monthly payments. 20-year is a middle ground. Our AI insights will help you compare.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}