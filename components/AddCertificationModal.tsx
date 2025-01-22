import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Certification } from "@/types"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  expiration_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

interface AddCertificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  historyId: string
  certification?: Certification
  onSuccess: () => void
}

export function AddCertificationModal({
  open,
  onOpenChange,
  historyId,
  certification,
  onSuccess,
}: AddCertificationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: certification?.name || "",
      issuer: certification?.issuer || "",
      issue_date: certification?.issue_date ? new Date(certification.issue_date).toISOString().split('T')[0] : "",
      expiration_date: certification?.expiration_date ? new Date(certification.expiration_date).toISOString().split('T')[0] : "",
      credential_id: certification?.credential_id || "",
      credential_url: certification?.credential_url || "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const endpoint = certification 
        ? `/api/certifications/${certification.id}`
        : `/api/certifications`

      const method = certification ? "PUT" : "POST"
      
      // Get the session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("Not authenticated - Please log in again")
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...values,
          history_id: historyId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to save certification: ${errorData}`)
      }

      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error saving certification:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {certification ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
          <DialogDescription>
            Add details about your certification. Expiration date and credential details are optional.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Name</FormLabel>
                  <FormControl>
                    <Input placeholder="AWS Solutions Architect Associate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input placeholder="Amazon Web Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="credential_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-123-XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credential_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://www.credly.com/badges/..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : certification ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 