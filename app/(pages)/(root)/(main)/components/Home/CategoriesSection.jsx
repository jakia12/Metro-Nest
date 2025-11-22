// app/components/CategoriesSection.tsx
"use client";

import {
  Building,
  Building2,
  Home,
  Landmark,
  MapPin,
  Warehouse,
} from "lucide-react";
import { useEffect, useState } from "react";

// Icon mapping for categories
const iconMap = {
  Apartment: Building2,
  House: Home,
  "Land Or Plot": MapPin,
  Commercial: Building,
  Villa: Landmark,
  Farm: Warehouse,
  Townhouse: Building,
  Penthouse: Landmark,
  Cottage: Warehouse,
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        const result = await response.json();

        if (result.success) {
          // Map categories with icons
          const categoriesWithIcons = result.data.map((cat) => ({
            ...cat,
            Icon: iconMap[cat.name] || Building2,
            countLabel: `${cat.propertyCount || 0} Property${
              cat.propertyCount !== 1 ? "ies" : ""
            }`,
          }));
          setCategories(categoriesWithIcons);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className="w-full bg-[#FBF7F5] py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-500">
            {/* <span className="h-[1px] w-8 bg-rose-500" />
            <span>Categories</span> */}
            <p className="text-red-500 font-semibold  uppercase tracking-[0.3em]">
              — Categories —
            </p>
          </div>

          <h2 className="mt-2 text-center text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl mb-[30px]">
            Choose Your Property Type
          </h2>
        </div>

        {/* Category Cards */}
        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20">
            <div className="text-lg text-gray-600">Loading categories...</div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-600">
                No categories found
              </div>
            ) : (
              categories.map((item) => {
                const IconComponent = item.Icon;
                return (
                  <button
                    key={item._id || item.name}
                    className="mt-[19px] md:mt-0 lg:mt-0 group relative flex flex-col items-center rounded-3xl bg-white px-6 pb-6 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    {/* Icon Circle */}
                    <div className="relative -mt-17 mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white ring-1 ring-slate-100 shadow-sm">
                      <IconComponent className="relative h-10 w-[30px] text-slate-900 group-hover:text-rose-500" />
                    </div>

                    <div className="text-center">
                      <p className="text-base font-semibold text-slate-900 sm:text-lg">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                        {item.countLabel}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
