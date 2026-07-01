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
