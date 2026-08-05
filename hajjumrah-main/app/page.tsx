import { Hero } from '@/components/hero'
import { PackageComparison } from '@/components/package-comparison'
import { JourneyTimeline } from '@/components/journey-timeline'
import { AccommodationCards } from '@/components/accommodation-cards'
import { PriceEstimator } from '@/components/price-estimator'
import { InquiryWizard } from '@/components/inquiry-wizard'
import { Testimonials } from '@/components/testimonials'
import { ConciergeButton } from '@/components/concierge-button'

export default function Page() {
  return (
    <main className="bg-background text-foreground overflow-hidden pt-20">
      <Hero />
      <PackageComparison />
      <JourneyTimeline />
      <AccommodationCards />
      <PriceEstimator />
      <InquiryWizard />
      <Testimonials />
      <ConciergeButton />
    </main>
  )
}
