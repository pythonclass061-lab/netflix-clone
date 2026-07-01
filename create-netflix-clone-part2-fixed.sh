#!/bin/bash

# =============================================
# Netflix Clone - Complete Project Generator
# Part 2: Frontend & Docker Configuration (FIXED)
# =============================================

set -e

# Find the project directory
if [ -d "netflix-clone" ]; then
    cd netflix-clone
elif [ ! -d "backend" ]; then
    echo "❌ Error: Cannot find the netflix-clone project!"
    echo "Please run this script from the same directory as Part 1,"
    echo "or from inside the netflix-clone directory."
    exit 1
fi

echo "✅ Found project at: $(pwd)"
echo "🎨 Creating frontend..."

# =============================================
# FRONTEND STRUCTURE
# =============================================
mkdir -p frontend/src/{app/{login,signup,browse,search,my-list,profiles,watch},components,hooks,store,services,types,utils}
mkdir -p frontend/public

# Frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "netflix-clone-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.2",
    "framer-motion": "^10.16.16",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.2",
    "react-icons": "^4.12.0",
    "react-player": "^2.13.0",
    "react-toastify": "^9.1.3",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
EOF

# Frontend tsconfig.json
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Next.js config
cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', 'occ-0-769-300.1.nflxso.net'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  },
};

module.exports = nextConfig;
EOF

# Tailwind config
cat > frontend/tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          dark: '#141414',
          darker: '#000000',
          gray: '#808080',
          light: '#E5E5E5',
        }
      },
      backgroundImage: {
        'gradient-to-b': 'linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,0.15) 15%, rgba(20,20,20,0.35) 29%, rgba(20,20,20,0.58) 44%, #141414 68%, #141414 100%)',
      }
    },
  },
  plugins: [],
}
export default config
EOF

# PostCSS config
cat > frontend/postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Frontend .env.example
cat > frontend/.env.example << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
EOF

# Frontend Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

echo "📝 Creating frontend source files..."

# Global CSS
cat > frontend/src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    @apply bg-black text-white;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  .btn-primary {
    @apply bg-netflix-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition duration-200;
  }

  .btn-secondary {
    @apply bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded transition duration-200;
  }

  .input-field {
    @apply w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-white focus:outline-none transition duration-200;
  }

  .netflix-container {
    @apply max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16;
  }

  .movie-slider {
    @apply flex gap-1 overflow-x-scroll pb-4;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .movie-slider::-webkit-scrollbar {
    display: none;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45);
  }

  .banner-gradient {
    background: linear-gradient(77deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 85%);
  }
}
EOF

# Types
cat > frontend/src/types/index.ts << 'EOF'
export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  profiles: Profile[];
  subscription: Subscription;
  paymentMethods: PaymentMethod[];
  watchlist: string[];
  continueWatching: ContinueWatching[];
  emailVerified: boolean;
}

export interface Profile {
  name: string;
  avatar: string;
  isKid: boolean;
}

export interface Subscription {
  plan: 'mobile' | 'basic' | 'standard' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
}

export interface PaymentMethod {
  type: 'card' | 'paypal';
  lastFour: string;
  expiryDate: string;
  cardType: string;
  isDefault: boolean;
}

export interface ContinueWatching {
  contentId: string;
  progress: number;
  timestamp: string;
}

export interface Content {
  _id?: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  trailerUrl?: string;
  mediaType: 'movie' | 'tv';
  genres: string[];
  releaseDate: string;
  rating: number;
  popularity: number;
  runtime?: number;
  voteCount?: number;
}
EOF

# API Service
cat > frontend/src/services/api.ts << 'EOF'
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const moviesAPI = {
  getTrending: () => api.get('/movies/trending'),
  getPopular: (type = 'movie') => api.get(`/movies/popular?type=${type}`),
  getTopRated: () => api.get('/movies/top-rated'),
  search: (query: string) => api.get(`/movies/search?query=${query}`),
  getDetails: (id: number, type = 'movie') => api.get(`/movies/${id}?type=${type}`),
};

export const paymentAPI = {
  addCard: (data: any) => api.post('/payments/add-card', data),
  getMethods: () => api.get('/payments/methods'),
};

export const watchlistAPI = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (contentId: string) => api.post('/watchlist/add', { contentId }),
  removeFromWatchlist: (contentId: string) => api.delete(`/watchlist/remove/${contentId}`),
};

export default api;
EOF

# Zustand Store
cat > frontend/src/store/useStore.ts << 'EOF'
import { create } from 'zustand';
import { User, Content } from '@/types';

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedProfile: number;
  myList: Content[];

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setSelectedProfile: (index: number) => void;
  setMyList: (list: Content[]) => void;
  addToMyList: (content: Content) => void;
  removeFromMyList: (contentId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  selectedProfile: 0,
  myList: [],

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, myList: [] });
  },

  setSelectedProfile: (index) => set({ selectedProfile: index }),

  setMyList: (list) => set({ myList: list }),

  addToMyList: (content) => set((state) => ({
    myList: [...state.myList, content]
  })),

  removeFromMyList: (contentId) => set((state) => ({
    myList: state.myList.filter((item) => item._id !== contentId)
  })),
}));
EOF

# Hooks
cat > frontend/src/hooks/useAuth.ts << 'EOF'
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { authAPI } from '@/services/api';

export const useAuth = () => {
  const { token, setUser, logout } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, setUser, logout]);

  return { loading };
};
EOF

# Main Layout
cat > frontend/src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Netflix Clone - Watch TV Shows Online, Watch Movies Online',
  description: 'Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
EOF

# Providers
cat > frontend/src/app/providers.tsx << 'EOF'
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </QueryClientProvider>
  )
}
EOF

# Homepage
cat > frontend/src/app/page.tsx << 'EOF'
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import { motion } from 'framer-motion'
import { FiChevronRight } from 'react-icons/fi'

export default function HomePage() {
  const { isAuthenticated } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/browse')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="relative h-[90vh] bg-gradient-to-b from-black/60 to-black">
        <div className="absolute inset-0">
          <img
            src="https://assets.nflxext.com/ffe/siteui/vlv3/9c5457b8-9ab0-4a04-9fc1-e608d5670f1a/710d74e0-7158-408e-8d9b-23c219dee5df/IN-en-20210719-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
            alt="Netflix Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full netflix-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow">
              Unlimited movies, TV shows and more
            </h1>
            <p className="text-2xl mb-6 text-shadow">
              Watch anywhere. Cancel anytime.
            </p>
            <p className="text-lg mb-6 text-shadow">
              Ready to watch? Enter your email to create or restart your membership.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-4 bg-black/60 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white"
              />
              <button
                onClick={() => router.push('/signup')}
                className="bg-netflix-red hover:bg-red-700 text-white text-xl font-bold px-8 py-4 rounded flex items-center justify-center gap-2 transition duration-200"
              >
                Get Started
                <FiChevronRight className="text-2xl" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-16 netflix-container">
        <h2 className="text-3xl font-bold mb-8">More Reasons to Join</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Enjoy on your TV', description: 'Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.', icon: '📺' },
            { title: 'Download your shows to watch offline', description: 'Save your favourites easily and always have something to watch.', icon: '📥' },
            { title: 'Watch everywhere', description: 'Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.', icon: '📱' },
            { title: 'Create profiles for kids', description: 'Send kids on adventures with their favourite characters in a space made just for them — free with your membership.', icon: '👶' }
          ].map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-b from-[#192144] to-[#0c1132] p-6 rounded-2xl"
            >
              <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
              <p className="text-gray-400">{reason.description}</p>
              <div className="text-4xl mt-4">{reason.icon}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <FAQ />
      <Footer />
    </div>
  )
}
EOF

# Header Component
cat > frontend/src/components/Header.tsx << 'EOF'
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
EOF

# Hero Banner
cat > frontend/src/components/HeroBanner.tsx << 'EOF'
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
EOF

# Movie Row Component
cat > frontend/src/components/MovieRow.tsx << 'EOF'
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
EOF

# Browse Page
cat > frontend/src/app/browse/page.tsx << 'EOF'
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
EOF

# Login Page
cat > frontend/src/app/login/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { authAPI } from '@/services/api'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      const { token, user } = response.data

      setToken(token)
      setUser(user)
      toast.success('Welcome back!')
      router.push('/browse')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <div className="absolute inset-0">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/9c5457b8-9ab0-4a04-9fc1-e608d5670f1a/710d74e0-7158-408e-8d9b-23c219dee5df/IN-en-20210719-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative z-10 bg-black/75 p-16 rounded-md max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-gray-400">
          <p>
            New to Netflix?{' '}
            <Link href="/signup" className="text-white hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
EOF

# Signup Page
cat > frontend/src/app/signup/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { authAPI } from '@/services/api'
import { toast } from 'react-toastify'
import { FiCheck, FiLock } from 'react-icons/fi'

const PLANS = [
  { name: 'Mobile', price: 'USD 2.99/month', quality: '480p', devices: 'Phone, Tablet', screens: 1 },
  { name: 'Basic', price: 'USD 3.99/month', quality: '720p', devices: 'Phone, Tablet, Computer, TV', screens: 1 },
  { name: 'Standard', price: 'USD 7.99/month', quality: '1080p', devices: 'Phone, Tablet, Computer, TV', screens: 2 },
  { name: 'Premium', price: 'USD 11.99/month', quality: '4K+HDR', devices: 'Phone, Tablet, Computer, TV', screens: 4 }
]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('Standard')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useStore()
  const router = useRouter()

  const handleSignup = async () => {
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid credit card number.')
      return
    }

    const expYear = parseInt(expiry.split('/')[1])
    if (expYear < 2026 || expYear > 2051) {
      toast.error('Expiration Year must be between 2026 and 2051.')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register({ email, password, name })
      const { token, user } = response.data

      setToken(token)
      setUser(user)
      toast.success('Account created successfully!')
      router.push('/browse')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-netflix-red text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>NETFLIX</h1>
          <button onClick={() => router.push('/login')} className="text-black font-bold hover:underline">Sign In</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-netflix-red text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <FiCheck /> : s}
              </div>
              {s < 3 && <div className={`w-20 h-1 ${step > s ? 'bg-netflix-red' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-2">STEP 1 OF 3</p>
            <h1 className="text-3xl font-bold text-black mb-4">Create your account</h1>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:border-black" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:border-black" />
              <input type="password" placeholder="Add a password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:border-black" />
              <button onClick={() => setStep(2)} disabled={!email || !password || !name} className="w-full bg-netflix-red text-white font-bold py-4 rounded hover:bg-red-700 transition disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 mb-2">STEP 2 OF 3</p>
            <h1 className="text-3xl font-bold text-black mb-4">Choose your plan</h1>
            <div className="space-y-3">
              {PLANS.map((plan) => (
                <div key={plan.name} onClick={() => setSelectedPlan(plan.name)} className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  selectedPlan === plan.name ? 'border-netflix-red bg-red-50' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-black">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.quality} • {plan.devices}</p>
                      <p className="text-sm text-gray-600">{plan.screens} screen{plan.screens > 1 ? 's' : ''}</p>
                    </div>
                    <span className="font-bold text-black">{plan.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="w-full bg-netflix-red text-white font-bold py-4 rounded hover:bg-red-700 transition mt-6">Next</button>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-2">STEP 3 OF 3</p>
            <h1 className="text-3xl font-bold text-black mb-4">Set up your credit or debit card</h1>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center space-x-2 text-sm text-gray-600">
              <FiLock />
              <span>Your payments are encrypted and secure</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={19} className="w-full px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:border-black" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">VISA</span>
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">MC</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} maxLength={5} className="w-full px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input type="text" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} className="w-full px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:border-black" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
                <input type="text" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:border-black" />
              </div>

              <button onClick={handleSignup} disabled={loading} className="w-full bg-netflix-red text-white font-bold py-4 rounded hover:bg-red-700 transition disabled:opacity-50">
                {loading ? 'Processing...' : 'Start Membership'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
EOF

# FAQ Component
cat > frontend/src/components/FAQ.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX } from 'react-icons/fi'

const FAQS = [
  { question: 'What is Netflix?', answer: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices.' },
  { question: 'How much does Netflix cost?', answer: 'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from USD 2.99 to USD 11.99 a month.' },
  { question: 'Where can I watch?', answer: 'Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device.' },
  { question: 'How do I cancel?', answer: 'Netflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks.' },
  { question: 'What can I watch on Netflix?', answer: 'Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more.' }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="py-16 netflix-container">
      <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
      <div className="space-y-2 max-w-4xl mx-auto">
        {FAQS.map((faq, index) => (
          <div key={index} className="bg-[#2D2D2D] overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-[#414141] transition"
            >
              <span className="text-xl">{faq.question}</span>
              {openIndex === index ? <FiX className="text-2xl flex-shrink-0" /> : <FiPlus className="text-2xl flex-shrink-0" />}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-6 pt-0 text-lg text-gray-300 border-t border-black">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
EOF

# Footer Component
cat > frontend/src/components/Footer.tsx << 'EOF'
export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-16 netflix-container">
      <p className="mb-8">Questions? Call <a href="tel:000-800-919-1694" className="underline hover:text-gray-300">000-800-919-1694</a></p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="space-y-3">
          <a href="#" className="block hover:underline">FAQ</a>
          <a href="#" className="block hover:underline">Investor Relations</a>
          <a href="#" className="block hover:underline">Privacy</a>
          <a href="#" className="block hover:underline">Speed Test</a>
        </div>
        <div className="space-y-3">
          <a href="#" className="block hover:underline">Help Centre</a>
          <a href="#" className="block hover:underline">Jobs</a>
          <a href="#" className="block hover:underline">Cookie Preferences</a>
          <a href="#" className="block hover:underline">Legal Notices</a>
        </div>
        <div className="space-y-3">
          <a href="#" className="block hover:underline">Account</a>
          <a href="#" className="block hover:underline">Ways to Watch</a>
          <a href="#" className="block hover:underline">Corporate Information</a>
          <a href="#" className="block hover:underline">Only on Netflix</a>
        </div>
        <div className="space-y-3">
          <a href="#" className="block hover:underline">Media Centre</a>
          <a href="#" className="block hover:underline">Terms of Use</a>
          <a href="#" className="block hover:underline">Contact Us</a>
        </div>
      </div>
      <div className="mt-8">
        <select className="bg-black border border-gray-600 text-white px-4 py-2 rounded">
          <option value="en">🌐 English</option>
          <option value="ne">🇳🇵 Nepali</option>
        </select>
      </div>
      <p className="mt-6 text-sm">Netflix Clone - For Educational Purposes</p>
    </footer>
  )
}
EOF

# Search Page
cat > frontend/src/app/search/page.tsx << 'EOF'
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
EOF

# My List Page
cat > frontend/src/app/my-list/page.tsx << 'EOF'
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
EOF

echo ""
echo "✅ Frontend created successfully!"
echo ""
echo "📁 Complete project at: $(pwd)"
echo ""
echo "🚀 Quick start commands:"
echo ""
echo "1. Install backend dependencies:"
echo "   cd backend && npm install"
echo ""
echo "2. Install frontend dependencies:"
echo "   cd frontend && npm install"
echo ""
echo "3. Set up environment:"
echo "   cp backend/.env.example backend/.env"
echo "   # Add your TMDB API key to backend/.env"
echo ""
echo "4. Start development servers:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:3000"
echo ""
echo "📦 To push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Initial commit - Netflix clone'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/netflix-clone.git"
echo "   git push -u origin main"
echo ""
echo "🐳 Or use Docker:"
echo "   docker-compose up -d"
