import { useState, useEffect, useCallback, useRef } from "react"

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useInfiniteScroll<T>(
  items: T[],
  pageSize: number = 10,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = "100px", enabled = true } = options
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const displayedItems = items.slice(0, currentPage * pageSize)

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      setCurrentPage(prev => {
        const nextPage = prev + 1
        setHasMore(nextPage < totalPages)
        return nextPage
      })
      setIsLoading(false)
    }, 500)
  }, [isLoading, hasMore, totalPages])

  useEffect(() => {
    if (!enabled || !loadingRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observerRef.current = observer
    observer.observe(loadingRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore, isLoading, threshold, rootMargin, enabled])

  const reset = useCallback(() => {
    setCurrentPage(1)
    setHasMore(true)
    setIsLoading(false)
  }, [])

  return {
    displayedItems,
    isLoading,
    hasMore,
    loadMore,
    reset,
    loadingRef,
    currentPage,
    totalPages,
  }
}
