import BenefitsSection from "./components/Home/BenefitsSection";
import CategoriesSection from "./components/Home/CategoriesSection";
import ExploreNeighborhoodsSection from "./components/Home/ExploreNeighborhoodsSection";
import FaqSection from "./components/Home/FaqSection";
import FeaturedProperties from "./components/Home/FeaturedProperties";
import GallerySection from "./components/Home/GallerySection";
import HeroSection from "./components/Home/HeroSection";

import PropertyCarousel from "./components/Home/PropertyCarousel";
import TestimonialSection from "./components/Home/TestimonialSection";

export default function Home() {
  return (
    <>
     <HeroSection/>
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
