'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import MovieRow from '@/components/MovieRow'
import Footer from '@/components/Footer'
import { moviesAPI } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export default function BrowsePage() {
  const { isAuthenticated } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const response = await moviesAPI.getTrending()
      return response.data.results
    }
  })

  const { data: popular } = useQuery({
    queryKey: ['popular'],
    queryFn: async () => {
      const response = await moviesAPI.getPopular()
      return response.data.results
    }
  })

  const { data: topRated } = useQuery({
    queryKey: ['topRated'],
    queryFn: async () => {
      const response = await moviesAPI.getTopRated()
      return response.data.results
    }
  })

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroBanner />

      <div className="-mt-32 relative z-10">
        {trending && <MovieRow title="Trending Now" movies={trending} isLarge />}
        {popular && <MovieRow title="Popular on Netflix" movies={popular} />}
        {topRated && <MovieRow title="Top Rated" movies={topRated} />}
      </div>

      <Footer />
    </div>
  )
}
