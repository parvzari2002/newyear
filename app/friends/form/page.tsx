'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormData } from '@/lib/types'

export default function FriendsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name1: '',
    name2: '',
    relationship: '',
    favoriteMemory: '',
    message: '',
    year: new Date().getFullYear().toString(),
  })
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Save to session storage
    const sessionId = `friends_${Date.now()}`
    sessionStorage.setItem('userSession', JSON.stringify({
      id: sessionId,
      type: 'friends',
      formData,
      createdAt: new Date().toISOString(),
    }))

    // Navigate to display page
    router.push(`/friends/display?session=${sessionId}`)
  }

  return (
    <div className="min-h-screen gradient-bg-3 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Users className="w-16 h-16 text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Friends' New Year Form</h1>
          <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name1"
                  value={formData.name1}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Friend's Name *
                </label>
                <input
                  type="text"
                  name="name2"
                  value={formData.name2}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Enter friend's name"
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  How long have you been friends? *
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  placeholder="e.g., 5 years, since childhood"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Best Memory Together
                </label>
                <textarea
                  name="favoriteMemory"
                  value={formData.favoriteMemory}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Share a fun memory..."
                />
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Personal Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Write a fun message for the New Year..."
                />
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="font-bold text-gray-800 mb-4">Review Your Information</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Your Name:</strong> {formData.name1}</p>
                  <p><strong>Friend's Name:</strong> {formData.name2}</p>
                  <p><strong>Friends for:</strong> {formData.relationship}</p>
                  {formData.favoriteMemory && (
                    <p><strong>Best Memory:</strong> {formData.favoriteMemory}</p>
                  )}
                  {formData.message && (
                    <p><strong>Message:</strong> {formData.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Back
              </button>
            )}
            <div className="ml-auto">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2"
                >
                  Create Wishes <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

