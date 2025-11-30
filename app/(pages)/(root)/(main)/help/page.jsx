import { Book, ChevronRight, ExternalLink, HelpCircle, Mail, MessageSquare, Phone, Search, Video } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Help Center | MetroNest",
  description: "Find answers to your questions and get help with MetroNest real estate platform.",
};

export default function HelpCenterPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: Book,
      color: "rose",
      articles: [
        "How to create an account",
        "Setting up your profile",
        "Understanding property types",
        "How to search for properties",
      ]
    },
    {
      title: "Buying & Renting",
      icon: Search,
      color: "blue",
      articles: [
        "How to contact property owners",
        "Scheduling property viewings",
        "Making an offer",
        "Understanding rental agreements",
      ]
    },
    {
      title: "Listing Properties",
      icon: Video,
      color: "green",
      articles: [
        "How to list a property",
        "Adding photos and descriptions",
        "Pricing your property",
        "Managing your listings",
      ]
    },
    {
      title: "Account & Settings",
      icon: MessageSquare,
      color: "purple",
      articles: [
        "Updating your profile",
        "Changing your password",
        "Notification preferences",
        "Deleting your account",
      ]
    },
  ];

  const popularTopics = [
    "How do I reset my password?",
    "How to verify my account?",
    "What payment methods are accepted?",
    "How to report a listing?",
    "How to contact customer support?",
    "Understanding property verification",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0b2845] to-[#1a4d7a] text-white py-20">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500">
                <HelpCircle className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help You?</h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto mb-8">
              Search our knowledge base or browse categories below to find answers to your questions.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full rounded-full bg-white px-12 py-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-rose-500/20 transition shadow-lg"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Browse by Category</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              const colorClasses = {
                rose: "bg-rose-100 text-rose-600 border-rose-200",
                blue: "bg-blue-100 text-blue-600 border-blue-200",
                green: "bg-green-100 text-green-600 border-green-200",
                purple: "bg-purple-100 text-purple-600 border-purple-200",
              };
              
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[category.color]} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sm text-slate-600 hover:text-rose-600 transition-colors group"
                        >
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Popular Topics</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="grid gap-4 md:grid-cols-2">
              {popularTopics.map((topic, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <span className="flex-1 text-slate-700 group-hover:text-slate-900 font-medium">{topic}</span>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">
                <Phone className="h-7 w-7 text-rose-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
            <p className="text-slate-600 mb-4 text-sm">
              Speak with our support team
            </p>
            <p className="text-rose-600 font-semibold mb-4">+00 (123) 456 789 012</p>
            <p className="text-xs text-slate-500">Mon-Fri, 9am-6pm EST</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <Mail className="h-7 w-7 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-600 mb-4 text-sm">
              Get help via email
            </p>
            <p className="text-blue-600 font-semibold mb-4">support@metronest.com</p>
            <p className="text-xs text-slate-500">Response within 24 hours</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
                <MessageSquare className="h-7 w-7 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Submit Ticket</h3>
            <p className="text-slate-600 mb-4 text-sm">
              Create a support ticket
            </p>
            <Link
              href="/support"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Create Ticket
            </Link>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-r from-[#0b2845] to-[#1a4d7a] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
          <p className="text-slate-200 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-full font-medium hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
