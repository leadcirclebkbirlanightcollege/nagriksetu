import { useCallback, useEffect, useRef, useState } from "react"

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

/** Generic data-loading hook with loading/error state and manual reload. */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    loader()
      .then((result) => {
        if (mounted.current) setData(result)
      })
      .catch((e: unknown) => {
        if (mounted.current) setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => {
        if (mounted.current) setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])
  return { data, loading, error, reload }
}
