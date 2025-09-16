import FeaturesSection from "@/components/FeaturesSection";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Navbar />
      <Hero />
      <FeaturesSection />
    </motion.div>
  );
}