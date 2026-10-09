import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchIPOList } from './api'

const IPOContext = createContext(null)

export function IPOProvider({ children }) {
  const [buckets, setBuckets] = useState(null)
  const [totalcount, setTotalcount] = useState(0)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      const { buckets, totalcount } = await fetchIPOList()
      setBuckets(buckets)
      setTotalcount(totalcount)
      setStatus('ready')
    } catch (e) {
      setError(e.message || 'Unknown error')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <IPOContext.Provider value={{ buckets, totalcount, status, error, reload: load }}>
      {children}
    </IPOContext.Provider>
  )
}

export function useIPO() {
  const ctx = useContext(IPOContext)
  if (!ctx) throw new Error('useIPO must be used within IPOProvider')
  return ctx
}
