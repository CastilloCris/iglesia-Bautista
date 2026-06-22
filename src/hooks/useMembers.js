import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: requestError }) => {
        setMembers(data ?? [])
        setError(requestError)
        setLoading(false)
      })
  }, [])

  return { members, loading, error }
}
