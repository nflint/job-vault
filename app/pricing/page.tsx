import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const tiers = [
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

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your job search journey
        </p>
      </div>

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
            {tier.highlighted && (
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

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

            <ul className="space-y-4 flex-grow mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

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

      <div className="text-center mt-16">
        <p className="text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  )
} 