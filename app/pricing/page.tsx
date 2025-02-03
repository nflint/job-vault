/**
 * @fileoverview Pricing page component that displays subscription tiers and their features
 * Implements a responsive pricing table with highlighted premium options
 */

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/**
 * Interface defining the structure of a pricing tier
 * @interface
 */
interface PricingTier {
  /** Name of the pricing tier */
  name: string
  /** Monthly price in USD */
  price: string
  /** Short description of the tier */
  description: string
  /** List of features included in the tier */
  features: string[]
  /** Call-to-action button text */
  cta: string
  /** Whether this tier should be visually highlighted */
  highlighted: boolean
}

/** Array of pricing tiers with their respective features and pricing information */
const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started with job tracking",
    features: [
      "Track up to 25 job applications",
      "Basic resume builder",
      "Job application timeline",
      "Simple analytics dashboard",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "12",
    description: "Ideal for serious job seekers",
    features: [
      "Track unlimited job applications",
      "Advanced resume builder & AI suggestions",
      "Custom application tracking fields",
      "Advanced analytics & insights",
      "Export data in multiple formats",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "20",
    description: "Perfect for career coaches and teams",
    features: [
      "Everything in Pro",
      "Team collaboration features",
      "Bulk job import/export",
      "Career coaching tools",
      "Team analytics dashboard",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

/**
 * Pricing page component that displays available subscription tiers
 * Implements a responsive grid layout with feature lists and CTAs
 * 
 * @returns {JSX.Element} Rendered pricing page with subscription tiers
 * 
 * @example
 * // In app routing:
 * <Route path="/pricing" component={PricingPage} />
 */
export default function PricingPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your job search journey
        </p>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative flex flex-col p-8 rounded-xl ${
              tier.highlighted
                ? "border-2 border-primary shadow-lg scale-105"
                : "border border-border"
            }`}
          >
            {/* Highlight Badge */}
            {tier.highlighted && (
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            {/* Tier Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight">
                  ${tier.price}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-4 text-muted-foreground">{tier.description}</p>
            </div>

            {/* Feature List */}
            <ul className="space-y-4 flex-grow mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Call to Action */}
            <Button
              size="lg"
              className={`w-full ${
                tier.highlighted ? "bg-primary" : "bg-secondary"
              }`}
            >
              {tier.cta}
            </Button>
          </Card>
        ))}
      </div>

      {/* Trial Notice */}
      <div className="text-center mt-16">
        <p className="text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  )
} 