import { Nav } from '../components/landing/Nav'
import { Hero } from '../components/landing/Hero'
import { HowItWorks } from '../components/landing/HowItWorks'
import { PredictDemo } from '../components/landing/PredictDemo'
import { Rivalry } from '../components/landing/Rivalry'
import { Footer } from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <Nav />
      <Hero />
      <HowItWorks />
      <PredictDemo />
      <Rivalry />
      <Footer />
    </div>
  )
}