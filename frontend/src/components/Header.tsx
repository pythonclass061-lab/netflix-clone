'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { FiSearch, FiBell } from 'react-icons/fi'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, user } = useStore()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="netflix-container flex items-center justify-between py-4">
        <div className="flex items-center space-x-8">
          <h1
            className="text-netflix-red text-2xl md:text-3xl font-bold cursor-pointer"
            onClick={() => router.push(isAuthenticated ? '/browse' : '/')}
          >
            NETFLIX
          </h1>
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => router.push('/browse')} className="text-sm text-gray-300 hover:text-white transition">Home</button>
              <button className="text-sm text-gray-300 hover:text-white transition">TV Shows</button>
              <button className="text-sm text-gray-300 hover:text-white transition">Movies</button>
              <button className="text-sm text-gray-300 hover:text-white transition">New & Popular</button>
              <button onClick={() => router.push('/my-list')} className="text-sm text-gray-300 hover:text-white transition">My List</button>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button onClick={() => router.push('/search')} className="text-white hover:text-gray-300">
                <FiSearch className="text-xl" />
              </button>
              <button className="text-white hover:text-gray-300">
                <FiBell className="text-xl" />
              </button>
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-netflix-red hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
