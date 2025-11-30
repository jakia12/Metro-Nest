import { Database, Eye, FileText, Lock, Shield, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | MetroNest",
  description: "Learn how MetroNest protects your privacy and handles your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0b2845] to-[#1a4d7a] text-white py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-rose-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-lg text-slate-200 max-w-3xl">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-slate-300 mt-4">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Information We Collect */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
                  <Database className="h-6 w-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Personal Information</h3>
                  <p className="leading-relaxed">
                    We collect information you provide directly to us, including your name, email address, phone number, 
                    and property preferences when you create an account or use our services.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Usage Information</h3>
                  <p className="leading-relaxed">
                    We automatically collect certain information about your device and how you interact with our platform, 
                    including IP address, browser type, pages visited, and time spent on our site.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Property Information</h3>
                  <p className="leading-relaxed">
                    When you list a property or inquire about listings, we collect details about the property, 
                    including location, price, features, and images you provide.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
              </div>
              
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-semibold text-sm mt-0.5">1</span>
                  <span className="flex-1 leading-relaxed">To provide, maintain, and improve our services and user experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-semibold text-sm mt-0.5">2</span>
                  <span className="flex-1 leading-relaxed">To connect buyers, renters, and sellers with relevant property listings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-semibold text-sm mt-0.5">3</span>
                  <span className="flex-1 leading-relaxed">To send you updates, newsletters, and marketing communications (with your consent)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-semibold text-sm mt-0.5">4</span>
                  <span className="flex-1 leading-relaxed">To detect, prevent, and address fraud, security issues, and technical problems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-semibold text-sm mt-0.5">5</span>
                  <span className="flex-1 leading-relaxed">To comply with legal obligations and enforce our terms of service</span>
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Data Security</h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information from unauthorized 
                access, disclosure, alteration, and destruction. This includes:
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Encryption</h4>
                  <p className="text-sm text-slate-600">SSL/TLS encryption for data in transit</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Access Control</h4>
                  <p className="text-sm text-slate-600">Restricted access to personal data</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Regular Audits</h4>
                  <p className="text-sm text-slate-600">Security assessments and updates</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Secure Storage</h4>
                  <p className="text-sm text-slate-600">Protected database infrastructure</p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your Rights</h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                You have the right to:
              </p>
              
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Access and receive a copy of your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Correct inaccurate or incomplete information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Request deletion of your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Opt-out of marketing communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Object to processing of your data for certain purposes</span>
                </li>
              </ul>
            </section>

            {/* Contact Us */}
            <section className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-rose-600" />
                <h2 className="text-2xl font-bold text-slate-900">Questions About Privacy?</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions or concerns about our privacy practices, please contact us at:
              </p>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> privacy@metronest.com</p>
                <p><strong>Phone:</strong> +00 (123) 456 789 012</p>
                <p><strong>Address:</strong> West 2nd Lane, Inner Circular Road, New York City</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-lg text-slate-900 mb-4">Quick Navigation</h3>
                <nav className="space-y-2">
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Information We Collect</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">How We Use Your Info</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Data Security</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Your Rights</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Contact Us</a>
                </nav>
              </div>

              {/* Related Links */}
              <div className="bg-gradient-to-br from-[#0b2845] to-[#1a4d7a] rounded-2xl shadow-sm p-6 text-white">
                <h3 className="font-semibold text-lg mb-4">Related Documents</h3>
                <div className="space-y-3">
                  <a href="/terms" className="flex items-center gap-2 text-sm hover:text-rose-300 transition-colors">
                    <FileText className="h-4 w-4" />
                    Terms & Conditions
                  </a>
                  <a href="/help" className="flex items-center gap-2 text-sm hover:text-rose-300 transition-colors">
                    <FileText className="h-4 w-4" />
                    Help Center
                  </a>
                  <a href="/contact" className="flex items-center gap-2 text-sm hover:text-rose-300 transition-colors">
                    <FileText className="h-4 w-4" />
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
