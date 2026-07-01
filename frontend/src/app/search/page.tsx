'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import Header from '@/components/Header'
import { moviesAPI } from '@/services/api'
import { Content } from '@/types'
import { FiSearch } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { isAuthenticated } = useStore()
  const router = useRouter()

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return []
      const response = await moviesAPI.search(query)
      return response.data.results
    },
    enabled: query.length > 2
  })

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 netflix-container">
        <div className="relative max-w-xl mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search for a show, movie, genre, etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded border border-gray-600 focus:border-white focus:outline-none"
            autoFocus
          />
        </div>

        {isLoading && <div className="text-center text-gray-400 py-12">Searching...</div>}

        {results && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item: Content) => (
              <motion.div key={item.tmdbId} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="cursor-pointer group">
                <div className="relative overflow-hidden rounded-md">
                  <img src={item.posterPath} alt={item.title} className="w-full group-hover:scale-105 transition duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {query && !isLoading && (!results || results.length === 0) && (
          <div className="text-center text-gray-400 py-12">No results found for "{query}"</div>
        )}
      </div>
    </div>
  )
}
