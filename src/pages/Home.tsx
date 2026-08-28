import Hero from '../components/Hero';
import HomeLogos from '../components/HomeLogos';
import HomeFeatures from '../components/HomeFeatures';
import HomeShowcase from '../components/HomeShowcase';
import HomeStats from '../components/HomeStats';
import HomeCTA from '../components/HomeCTA';

const Home = () => {
  return (
    <main>
      <Hero />
      <HomeLogos />
      <HomeFeatures />
      <HomeShowcase />
      <HomeStats />
      <HomeCTA />
    </main>
  );
};

export default Home;
