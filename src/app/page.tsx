import Image from "next/image";
import ImageSlider from "./components/Slider";
import ProductSection from "./components/Products";

export default function Home() {
  return (
    <main>
      <ImageSlider />
      <ProductSection />
    </main>
  );
}
