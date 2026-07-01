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
