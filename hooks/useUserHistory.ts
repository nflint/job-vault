import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getProfessionalHistory, createProfessionalHistory } from '@/lib/professional-history'
import type { ProfessionalHistory } from '@/types'

export function useUserHistory() {
  const [userHistory, setUserHistory] = useState<ProfessionalHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadUserHistory() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setLoading(false)
          return
        }

        try {
          const history = await getProfessionalHistory(session.user.id)
          setUserHistory(history)
        } catch (e) {
          if (e instanceof Error && e.message === 'No professional history found') {
            // Create new history if none exists
            const newHistory = await createProfessionalHistory(session.user.id)
            setUserHistory(newHistory)
          } else {
            throw e
          }
        }
      } catch (e) {
        console.error('Error in useUserHistory:', e)
        setError(e instanceof Error ? e : new Error('Unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    loadUserHistory()
  }, [])

  return { userHistory, loading, error }
} 