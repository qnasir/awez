import { useCallback, useEffect, useState } from 'react'
import { useHashScroll } from '@/hooks/useHashScroll'
import { Preloader } from '@/components/Preloader/Preloader'
import { Cursor } from '@/components/Cursor/Cursor'
import { Navbar } from '@/components/Navbar/Navbar'
import { Hero } from '@/components/Hero/Hero'
import { LogoMarquee } from '@/components/LogoMarquee/LogoMarquee'
import { ProductShowcase } from '@/components/ProductShowcase/ProductShowcase'
import { FeatureSection } from '@/components/FeatureSection/FeatureSection'
import { BeforeAfter } from '@/components/BeforeAfter/BeforeAfter'
import { AISection } from '@/components/AISection/AISection'
import { Automation } from '@/components/Automation/Automation'
import { MobileApps } from '@/components/MobileApps/MobileApps'
import { Analytics } from '@/components/Analytics/Analytics'
import { Security } from '@/components/Security/Security'
import { Testimonials } from '@/components/Testimonials/Testimonials'
import { Pricing } from '@/components/Pricing/Pricing'
import { CTA } from '@/components/CTA/CTA'
import { Footer } from '@/components/Footer/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaderDone = useCallback(() => setReady(true), [])

  // Failsafe: the hero's entrance is gated on the loader reporting done. If that
  // signal is ever lost, the page must still end up visible — content is never
  // allowed to depend on an animation callback firing.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2200)
    return () => clearTimeout(t)
  }, [])

  useHashScroll(ready)

  return (
    <>
      <Preloader onDone={onLoaderDone} />
      <Cursor />
      <Navbar />

      <main id="main" className="relative">
        <Hero ready={ready} />
        <LogoMarquee />
        <ProductShowcase />
        <FeatureSection />
        <BeforeAfter />
        <AISection />
        <Automation />
        <MobileApps />
        <Analytics />
        <Security />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </>
  )
}
