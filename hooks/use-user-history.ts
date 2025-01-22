'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getProfessionalHistory, createProfessionalHistory } from '@/lib/professional-history'
import type { ProfessionalHistory } from '@/types'

export function useUserHistory() {
  const [userHistory, setUserHistory] = useState<ProfessionalHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log("useUserHistory effect starting")
    async function loadUserHistory() {
      try {
        console.log("Getting Supabase session")
        const { data: { session } } = await supabase.auth.getSession()
        console.log("Session:", session ? "Found" : "Not found")
        
        if (!session) {
          console.log("No session, setting loading to false")
          setLoading(false)
          return
        }

        try {
          console.log("Getting professional history for user:", session.user.id)
          const history = await getProfessionalHistory(session.user.id)
          console.log("Got professional history:", history)
          setUserHistory(history)
        } catch (e) {
          console.log("Error in getProfessionalHistory:", e)
          if (e instanceof Error && e.message === 'No professional history found') {
            console.log("Creating new professional history")
            const newHistory = await createProfessionalHistory(session.user.id)
            console.log("Created new history:", newHistory)
            setUserHistory(newHistory)
          } else {
            throw e
          }
        }
      } catch (e) {
        console.error('Error in useUserHistory:', e)
        setError(e instanceof Error ? e : new Error('Unknown error occurred'))
      } finally {
        console.log("Setting loading to false")
        setLoading(false)
      }
    }

    loadUserHistory()
  }, [])

  return { userHistory, loading, error }
} 