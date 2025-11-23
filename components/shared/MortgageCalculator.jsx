'use client'

import { Calculator, DollarSign, Lightbulb, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function MortgageCalculator({ defaultPrice = 500000 }) {
  const [formData, setFormData] = useState({
    propertyPrice: defaultPrice,
    downPayment: defaultPrice * 0.2,
    interestRate: 6.5,
    loanTerm: 30
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateMortgage = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/mortgage-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Calculator error:', error);
      alert('Failed to calculate. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const downPaymentPercent = ((formData.downPayment / formData.propertyPrice) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Calculator className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Mortgage Calculator</h2>
          <p className="text-sm text-gray-600">Get instant calculations with smart insights</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={calculateMortgage} className="space-y-6">
        {/* Property Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={formData.propertyPrice}
              onChange={(e) => handleChange('propertyPrice', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="500000"
              min="0"
              step="1000"
              required
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Down Payment
            </label>
            <span className="text-sm text-blue-600 font-medium">
              {downPaymentPercent}%
            </span>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={formData.downPayment}
              onChange={(e) => handleChange('downPayment', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="100000"
              min="0"
              step="1000"
              required
            />
          </div>
          <input
            type="range"
            min="0"
            max={formData.propertyPrice}
            step="1000"
            value={formData.downPayment}
            onChange={(e) => handleChange('downPayment', e.target.value)}
            className="w-full mt-2 accent-blue-600"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%)
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => handleChange('interestRate', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="6.5"
              min="0"
              max="20"
              required
            />
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (years)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[15, 20, 30].map(term => (
              <button
                key={term}
                type="button"
                onClick={() => handleChange('loanTerm', term)}
                className={`py-3 rounded-lg border-2 font-medium transition ${
                  formData.loanTerm === term
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {term} years
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Calculating with AI...
            </>
          ) : (
            <>
              <Calculator size={20} />
              Calculate with AI Insights
            </>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Monthly Payment */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-1">Estimated Monthly Payment</p>
            <p className="text-4xl font-bold">
              ${parseFloat(result.calculation.monthlyPayment).toLocaleString()}
            </p>
            <p className="text-sm opacity-75 mt-2">
              Principal & Interest only (excludes taxes, insurance, HOA)
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(result.calculation.loanAmount)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Interest</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(result.calculation.totalInterest)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Payment</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(result.calculation.totalPayment)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Down Payment</p>
              <p className="text-xl font-semibold text-gray-900">
                {result.calculation.downPaymentPercentage}%
              </p>
            </div>
          </div>

          {/* AI Insights */}
          {result.aiInsights && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-amber-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                  result.aiInsights.affordabilityScore === 'High' ? 'bg-green-100 text-green-700' :
                  result.aiInsights.affordabilityScore === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {result.aiInsights.affordabilityScore} Affordability
                </span>
              </div>

              <div className="space-y-3">
                {result.aiInsights.insights?.map((insight, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>

              {result.aiInsights.recommendation && (
                <div className="mt-4 pt-4 border-t border-amber-200">
                  <p className="text-sm font-medium text-gray-900 mb-1">💡 Recommendation:</p>
                  <p className="text-sm text-gray-700">{result.aiInsights.recommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center">
            ⚠️ This calculator provides estimates only. Actual rates and payments may vary. 
            Consult with a licensed mortgage professional for accurate information.
          </p>
        </div>
      )}
    </div>
  );
}