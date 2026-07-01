'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Content } from '@/types'
import { moviesAPI } from '@/services/api'
import { FiPlay, FiInfo } from 'react-icons/fi'

export default function HeroBanner() {
  const [featured, setFeatured] = useState<Content[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await moviesAPI.getTrending()
        setFeatured(response.data.results.slice(0, 5))
      } catch (error) {
        console.error('Error fetching featured:', error)
      }
    }
    fetchFeatured()
  }, [])

  useEffect(() => {
    if (featured.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [featured.length])

  if (featured.length === 0) return null

  const current = featured[currentIndex]

  return (
    <div className="relative h-[85vh] bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.tmdbId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={current.backdropPath}
            alt={current.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 banner-gradient" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-[35%] left-0 right-0 netflix-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow">
            {current.title}
          </h1>
          <p className="text-lg md:text-xl mb-6 text-shadow line-clamp-3">
            {current.overview}
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-black font-bold px-8 py-2 rounded flex items-center space-x-2 hover:bg-gray-300 transition">
              <FiPlay className="text-xl" />
              <span>Play</span>
            </button>
            <button className="bg-gray-600/80 text-white font-bold px-8 py-2 rounded flex items-center space-x-2 hover:bg-gray-600 transition">
              <FiInfo className="text-xl" />
              <span>More Info</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
