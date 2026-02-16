import { HeroSection } from "@/components/home/hero-section";
import { MotiveSection } from "@/components/home/motive-section";
import { SearchPreviewSection } from "@/components/home/search-preview";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SearchPreviewSection />
      <MotiveSection />
    </>
  );
}
