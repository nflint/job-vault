"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, History, Briefcase, GraduationCap, ScrollText, Settings2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
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
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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

      setFormData(prev => ({
        ...prev,
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
      }))
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile data')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
          first_name: formData.firstName,
          last_name: formData.lastName,
          job_title: formData.jobTitle,
          industry: formData.industry,
          years_experience: parseInt(formData.yearsExperience) || null,
          linkedin_url: formData.linkedinUrl,
          github_url: formData.githubUrl,
          portfolio_url: formData.portfolioUrl,
          phone: formData.phone,
          preferred_currency: formData.preferredCurrency,
          timezone: formData.timezone,
          email_notifications: formData.emailNotifications,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // Update email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        })
        if (emailError) throw emailError
      }

      // Update password if provided
      if (formData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password,
        })
        if (passwordError) throw passwordError
      }

      setSuccess('Profile updated successfully')
      setFormData(prev => ({ ...prev, password: '' }))
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-semibold">Profile</h1>
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
          </div>
        </div>

        {/* Main Content */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardDescription>Update your personal information and profile settings here.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      name="yearsExperience"
                      type="number"
                      value={formData.yearsExperience}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Social Links</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      name="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                    <Input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Security</h3>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (optional)</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                    <Input
                      id="preferredCurrency"
                      name="preferredCurrency"
                      value={formData.preferredCurrency}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              {error && (
                <div className="w-full p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="w-full p-3 rounded-md bg-green-100 text-green-800 text-sm dark:bg-green-900/50 dark:text-green-400">
                  {success}
                </div>
              )}
              <div className="w-full flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

