'use client';

import { Bookmark, Calendar } from 'lucide-react';
import PropertySearchNew from './PropertySearchNew';

export default function HeroBanner() {
  return (
    <div className="w-full min-h-screen bg-[#E0F5F9] px-4 py-8 md:py-16">
      <div className="mx-auto max-w-[1500px]">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 md:mb-12 px-4">
          Real estate for living and investments
        </h1>

        {/* Hero Card Container */}
        <div className="relative w-full">
          <div className="md:flex items-center justify-center gap-6">
            
            <div className='w-full lg:w-[72%]'>
  <img src="/images/banner/bn4.png" alt="" className='w-full md:h-[580px] h-[400px] rounded-3xl shadow-xl border border-[#0F172B]/2'/>
            </div>
            {/* Property Image Section */}
         

            {/* Property Details Card */}
           <div className='w-full lg:w-[28%]'>
             <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-6 md:h-[580px] h-auto mt-6 md:mt-0 lg:mt-0">
              
              {/* Address & Bookmark */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600">201 Prague Dr,</p>
                  <p className="text-sm text-slate-600">San Jose, CA 95119</p>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-b border-slate-200">
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-slate-900">4</p>
                  <p className="text-sm text-slate-600 mt-1">beds</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-slate-900">3</p>
                  <p className="text-sm text-slate-600 mt-1">baths</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-slate-900">1,868</p>
                  <p className="text-sm text-slate-600 mt-1">sqft</p>
                </div>
              </div>

              {/* Price & Split Options */}
              <div className="flex items-center justify-between py-2">
                <p className="text-2xl md:text-3xl font-bold text-slate-900">$1,650,000</p>
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300">
                  Split options →
                </button>
              </div>

              {/* Agent Section */}
              <div className="flex items-center justify-between py-5 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="relative  ">
                  <img src="/images/banner/agnt.png" alt="" className=' rounded-full w-16 h-16' />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Agent</p>
                    <p className="text-sm font-semibold text-slate-900">Amelia Stephenson</p>
                  </div>
                </div>
                <button className="px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300">
                  Contact
                </button>
              </div>

              {/* Request Tour Button */}
              <button className="w-full bg-[#F05454] hover:bg-[#F05454] text-white font-medium py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Request a tour</span>
              </button>
              <p className="text-xs text-center text-slate-500">Earliest at 11:00 tomorrow</p>
            </div>
           </div>
          </div>
        </div>
      </div>
        <PropertySearchNew />
    </div>
  );
}
