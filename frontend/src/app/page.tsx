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
