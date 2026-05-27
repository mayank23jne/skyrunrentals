import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import FeeCalculator from './components/FeeCalculator';
import AboutSection from './components/AboutSection';
// import StatsSection from './components/StatsSection';
// import DiscoverSection from './components/DiscoverSection';
import PopularTours from './components/PopularTours';
// import Services from './components/Services';
// import RecentTours from './components/RecentTours';
import Footer from './components/Footer';
import PromoBanners from './components/PromoBanners';
import PartnerLogos from './components/PartnerLogos';
import RegisterCTA from './components/RegisterCTA';
// import VideoBanner from './components/VideoBanner';
// import SpecialFeatures from './components/SpecialFeatures';
import Testimonial from './components/Testimonial';
// import RecentBlog from './components/RecentBlog';
import BackToTop from './components/BackToTop';


function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Destinations />
        <FeeCalculator />
        <PopularTours />
        <AboutSection />
        <PromoBanners />
        {/* <StatsSection /> */}
        {/* <DiscoverSection /> */}
        <PartnerLogos />
        <RegisterCTA />
        {/* <Services /> */}
        {/* <SpecialFeatures /> */}
        <Testimonial />
        {/* <VideoBanner /> */}
        {/* <RecentTours /> */}
        {/* <RecentBlog /> */}
      </main>
      <Footer />
      <BackToTop />

      <style>{`
        .min-h-screen { min-height: 100vh; overflow-x: hidden; }
        .bg-white { background-color: var(--bg-main); }
        // main { padding-top: 160px; }
      `}</style>
    </div>
  );
}

export default App;
