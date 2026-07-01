'use client'

import { useRef, useState } from 'react'
import { Content } from '@/types'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface MovieRowProps {
  title: string
  movies: Content[]
  isLarge?: boolean
}

export default function MovieRow({ title, movies, isLarge = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true)
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-2 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white pl-4 md:pl-12">
        {title}
      </h2>

      <div className="group relative">
        <button
          className={`absolute left-2 top-0 bottom-0 z-40 w-12 bg-black/50 text-white hidden group-hover:flex items-center justify-center transition ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        >
          <FiChevronLeft className="text-3xl" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-1 overflow-x-scroll scrollbar-hide px-4 md:px-12"
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.tmdbId || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex-none cursor-pointer group/item ${
                isLarge ? 'w-[200px] md:w-[250px]' : 'w-[150px] md:w-[200px]'
              }`}
            >
              <div className="relative overflow-hidden rounded-md hover:scale-105 transition duration-300">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="w-full object-cover rounded-md"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/40 transition">
                  <div className="absolute bottom-0 p-3 opacity-0 group-hover/item:opacity-100 transition">
                    <h3 className="text-white font-bold text-sm">{movie.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-green-500 font-bold">
                        {Math.round(movie.rating * 10)}% Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          className="absolute right-2 top-0 bottom-0 z-40 w-12 bg-black/50 text-white hidden group-hover:flex items-center justify-center"
          onClick={() => handleClick('right')}
        >
          <FiChevronRight className="text-3xl" />
        </button>
      </div>
    </div>
  )
}
