import BenefitsSection from "./components/Home/BenefitsSection";
import CategoriesSection from "./components/Home/CategoriesSection";
import ExploreNeighborhoodsSection from "./components/Home/ExploreNeighborhoodsSection";
import FaqSection from "./components/Home/FaqSection";
import FeaturedProperties from "./components/Home/FeaturedProperties";
import GallerySection from "./components/Home/GallerySection";
import HeroBanner from "./components/Home/HeroBanner";

import PropertyCarousel from "./components/Home/PropertyCarousel";
import TestimonialSection from "./components/Home/TestimonialSection";

export default function Home() {
  return (
    <>
     <HeroBanner/>
      {/* <PropertySearchNew /> */}

      <CategoriesSection />
      <PropertyCarousel />
      <BenefitsSection />
      <GallerySection />

      <ExploreNeighborhoodsSection />
      <FeaturedProperties />
      <TestimonialSection />
      <FaqSection />
    </>
  );
}
