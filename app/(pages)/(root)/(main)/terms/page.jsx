import { AlertCircle, Ban, FileText, Scale, ShieldCheck, UserCheck } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | MetroNest",
  description: "Read MetroNest's terms and conditions for using our real estate platform.",
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0b2845] to-[#1a4d7a] text-white py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-10 w-10 text-rose-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-lg text-slate-200 max-w-3xl">
            Please read these terms and conditions carefully before using MetroNest platform.
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
            {/* Acceptance of Terms */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
                  <ShieldCheck className="h-6 w-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Acceptance of Terms</h2>
              </div>
              
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  By accessing and using MetroNest ("the Platform"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms and Conditions govern your use of our website and services. We reserve the right to modify 
                  these terms at any time, and such modifications shall be effective immediately upon posting.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">User Accounts</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Account Registration</h3>
                  <p className="leading-relaxed">
                    To access certain features of the Platform, you must register for an account. You agree to provide 
                    accurate, current, and complete information during the registration process and to update such information 
                    to keep it accurate, current, and complete.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Account Security</h3>
                  <p className="leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                    that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Important Notice</h4>
                      <p className="text-sm text-amber-800">
                        You must be at least 18 years old to create an account and use our services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Property Listings */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Property Listings</h2>
              </div>
              
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  When listing a property on MetroNest, you represent and warrant that:
                </p>
                
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>You have the legal right to list the property</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>All information provided is accurate and truthful</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>Images and descriptions are your own or you have permission to use them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>The listing complies with all applicable laws and regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>You will update or remove the listing when it is no longer available</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Prohibited Activities</h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-900 font-medium">Fraudulent Listings</p>
                  <p className="text-xs text-red-700 mt-1">Posting false or misleading property information</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-900 font-medium">Spam or Harassment</p>
                  <p className="text-xs text-red-700 mt-1">Sending unsolicited messages to users</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-900 font-medium">Unauthorized Access</p>
                  <p className="text-xs text-red-700 mt-1">Attempting to access other users' accounts</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-900 font-medium">Data Scraping</p>
                  <p className="text-xs text-red-700 mt-1">Automated collection of platform data</p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Scale className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Limitation of Liability</h2>
              </div>
              
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  MetroNest acts as a platform connecting buyers, sellers, and renters. We do not own, sell, or rent 
                  properties listed on our platform. We are not responsible for:
                </p>
                
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>The accuracy of property listings or user-provided information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>Transactions between users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>Property condition, legal status, or ownership disputes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span>Any damages arising from your use of the platform</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Termination</h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to terminate or suspend your account and access to the Platform at our sole discretion, 
                without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, 
                us, or third parties, or for any other reason.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions About These Terms?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> legal@metronest.com</p>
                <p><strong>Phone:</strong> +00 (123) 456 789 012</p>
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
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Acceptance of Terms</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">User Accounts</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Property Listings</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Prohibited Activities</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Limitation of Liability</a>
                  <a href="#" className="block text-sm text-slate-600 hover:text-rose-600 transition-colors">Termination</a>
                </nav>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">Important</h3>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  By using MetroNest, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>

              {/* Related Links */}
              <div className="bg-gradient-to-br from-[#0b2845] to-[#1a4d7a] rounded-2xl shadow-sm p-6 text-white">
                <h3 className="font-semibold text-lg mb-4">Related Documents</h3>
                <div className="space-y-3">
                  <a href="/privacy" className="flex items-center gap-2 text-sm hover:text-rose-300 transition-colors">
                    <FileText className="h-4 w-4" />
                    Privacy Policy
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
