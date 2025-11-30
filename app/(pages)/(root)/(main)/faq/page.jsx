"use client";

import { ChevronDown, HelpCircle, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "General Questions",
      color: "rose",
      faqs: [
        {
          question: "What is MetroNest?",
          answer: "MetroNest is a modern real estate platform that connects buyers, renters, and sellers with premium properties in top locations. We provide a seamless experience for finding your dream home or listing your property."
        },
        {
          question: "Is MetroNest free to use?",
          answer: "Yes! Creating an account and browsing properties on MetroNest is completely free. We only charge a small commission when a property transaction is successfully completed through our platform."
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Register' button in the top navigation, fill in your details including name, email, and password, and verify your email address. Once verified, you can start browsing and listing properties."
        },
        {
          question: "What areas does MetroNest cover?",
          answer: "MetroNest currently operates in major metropolitan areas across the country. We're constantly expanding to new cities and regions. Check our property search to see available locations."
        },
      ]
    },
    {
      category: "For Buyers & Renters",
      color: "blue",
      faqs: [
        {
          question: "How do I search for properties?",
          answer: "Use our advanced search feature to filter properties by location, price range, property type, number of bedrooms, and more. You can also save your favorite searches for quick access later."
        },
        {
          question: "Can I schedule property viewings?",
          answer: "Yes! Each property listing has a 'Schedule Viewing' button. Click it to request a viewing time, and the property owner or agent will confirm your appointment."
        },
        {
          question: "How do I contact property owners?",
          answer: "Once you're logged in, you can use the 'Contact Owner' button on any property listing to send a message directly to the seller or agent. You can also call them using the provided phone number."
        },
        {
          question: "What is the mortgage calculator?",
          answer: "Our mortgage calculator helps you estimate your monthly payments based on the property price, down payment, interest rate, and loan term. It's a helpful tool for budgeting your home purchase."
        },
      ]
    },
    {
      category: "For Sellers & Agents",
      color: "green",
      faqs: [
        {
          question: "How do I list a property?",
          answer: "After creating an account, go to your dashboard and click 'Add New Listing'. Fill in the property details, upload high-quality photos, set your price, and publish. Your listing will be live immediately."
        },
        {
          question: "How much does it cost to list a property?",
          answer: "Listing a property on MetroNest is free! We only charge a small commission (typically 2-3%) when your property is successfully sold or rented through our platform."
        },
        {
          question: "How do I edit or remove my listing?",
          answer: "Go to your dashboard, find the property in 'My Listings', and click the edit or delete button. You can update any information or remove the listing at any time."
        },
        {
          question: "How long does it take for my listing to appear?",
          answer: "Your listing appears instantly after publishing! However, it may take up to 24 hours for it to appear in all search results and recommendations as our system indexes it."
        },
      ]
    },
    {
      category: "Account & Security",
      color: "purple",
      faqs: [
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
        },
        {
          question: "Is my personal information secure?",
          answer: "Absolutely! We use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for more details."
        },
        {
          question: "How do I verify my account?",
          answer: "After registration, check your email for a verification link. Click it to verify your account. Verified accounts have access to all features and are trusted more by other users."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account anytime from your account settings. Please note that this action is permanent and will remove all your listings and saved data."
        },
      ]
    },
    {
      category: "Payments & Transactions",
      color: "amber",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, and bank transfers. Payment details are securely processed through our encrypted payment gateway."
        },
        {
          question: "When do I pay the commission?",
          answer: "Commission is only paid after a successful transaction is completed. For sales, it's deducted from the final sale amount. For rentals, it's typically charged at lease signing."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees! Our commission structure is transparent and clearly stated in our Terms & Conditions. You'll know exactly what you're paying before any transaction."
        },
        {
          question: "How do refunds work?",
          answer: "Refund policies vary depending on the transaction type and stage. Contact our support team with your transaction details, and we'll review your case according to our refund policy."
        },
      ]
    },
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const colorClasses = {
    rose: "bg-rose-100 text-rose-600 border-rose-200",
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200",
    purple: "bg-purple-100 text-purple-600 border-purple-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0b2845] to-[#1a4d7a] text-white py-20">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500">
                <MessageCircle className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto mb-8">
              Find quick answers to common questions about MetroNest.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-white px-12 py-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-rose-500/20 transition shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1000px] px-4 py-12">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No results found</h3>
            <p className="text-slate-500">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses[category.color]}`}>
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{category.category}</h2>
                </div>
                
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <div
                        key={faqIndex}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                          <ChevronDown
                            className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-4 pt-2 text-slate-700 leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-16 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Still Have Questions?</h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is ready to help you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-full font-medium hover:bg-rose-700 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Visit Help Center
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-full font-medium border border-slate-300 hover:border-slate-400 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Submit a Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
