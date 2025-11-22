import BenefitsSection from "./components/Home/BenefitsSection";
import CategoriesSection from "./components/Home/CategoriesSection";
import ExploreNeighborhoodsSection from "./components/Home/ExploreNeighborhoodsSection";
import FaqSection from "./components/Home/FaqSection";
import FeaturedProperties from "./components/Home/FeaturedProperties";
import GallerySection from "./components/Home/GallerySection";

import PropertyCarousel from "./components/Home/PropertyCarousel";
import PropertySearchNew from "./components/Home/PropertySearchNew";
import TestimonialSection from "./components/Home/TestimonialSection";

export default function Home() {
  return (
    <>
      {/* <HeroSlider /> */}
      <PropertySearchNew />

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
