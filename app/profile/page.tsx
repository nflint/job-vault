"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { History, Briefcase, ScrollText, Settings2, EyeIcon, EyeOffIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { PageLayout } from "@/components/ui/page-layout"
import { Section } from "@/components/ui/section"
import { ContentCard } from "@/components/ui/card-content"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  yearsExperience: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  preferredCurrency: z.string(),
  timezone: z.string(),
  emailNotifications: z.boolean(),
})

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      jobTitle: "",
      industry: "",
      yearsExperience: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      phone: "",
      preferredCurrency: "USD",
      timezone: "UTC",
      emailNotifications: true,
    },
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  async function loadUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      form.reset({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        email: user.email || "",
        jobTitle: profile?.job_title || "",
        industry: profile?.industry || "",
        yearsExperience: profile?.years_experience?.toString() || "",
        linkedinUrl: profile?.linkedin_url || "",
        githubUrl: profile?.github_url || "",
        portfolioUrl: profile?.portfolio_url || "",
        phone: profile?.phone || "",
        preferredCurrency: profile?.preferred_currency || "USD",
        timezone: profile?.timezone || "UTC",
        emailNotifications: profile?.email_notifications ?? true,
      })
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile data')
    }
  }

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          job_title: data.jobTitle,
          industry: data.industry,
          years_experience: parseInt(data.yearsExperience || "0") || null,
          linkedin_url: data.linkedinUrl,
          github_url: data.githubUrl,
          portfolio_url: data.portfolioUrl,
          phone: data.phone,
          preferred_currency: data.preferredCurrency,
          timezone: data.timezone,
          email_notifications: data.emailNotifications,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // Update email if changed
      if (data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        })
        if (emailError) throw emailError
      }

      // Update password if provided
      if (data.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.password,
        })
        if (passwordError) throw passwordError
      }

      setSuccess('Profile updated successfully')
      form.setValue('password', '')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const navigationActions = (
    <div className="flex gap-2 flex-wrap">
      <Link href="/profile/professional-history">
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Professional History
        </Button>
      </Link>
      <Link href="/profile/skills">
        <Button variant="outline" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Skills
        </Button>
      </Link>
      <Link href="/profile/resumes">
        <Button variant="outline" className="flex items-center gap-2">
          <ScrollText className="h-4 w-4" />
          Resumes
        </Button>
      </Link>
      <Link href="/profile/settings">
        <Button variant="outline" className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          Settings
        </Button>
      </Link>
    </div>
  )

  return (
    <PageLayout
      title="Profile"
      description="Manage your personal information and profile settings"
      actions={navigationActions}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Section title="Personal Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          <Section title="Professional Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          <Section title="Social Links">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-500">
              {success}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </PageLayout>
  )
}

