'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { watchlistAPI } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

export default function MyListPage() {
  const { isAuthenticated } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const response = await watchlistAPI.getWatchlist()
      return response.data.watchlist
    },
    enabled: isAuthenticated
  })

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 netflix-container">
        <h1 className="text-3xl font-bold mb-8">My List</h1>
        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : watchlist && watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchlist.map((item: any) => (
              <motion.div key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cursor-pointer group">
                <img src={item.posterPath} alt={item.title} className="w-full rounded-md group-hover:scale-105 transition" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl mb-4">Your list is empty</p>
            <p>Add shows and movies to your list to watch them later.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
