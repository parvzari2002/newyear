'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Quote, Image as ImageIcon, Video, Activity } from 'lucide-react'
import Confetti from 'react-confetti'
import { ContentItem, UserSession } from '@/lib/types'

const gradients = [
  'gradient-bg-1',
  'gradient-bg-2',
  'gradient-bg-3',
  'gradient-bg-4',
  'gradient-bg-5',
]

export default function CoupleDisplay() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [session, setSession] = useState<UserSession | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Get session from storage
    const sessionData = sessionStorage.getItem('userSession')
    if (sessionData) {
      const parsed = JSON.parse(sessionData)
      setSession(parsed)
      
      // Fetch content
      fetchContent('couple')
    } else {
      router.push('/couple/form')
    }
  }, [router])

  const fetchContent = async (type: 'couple' | 'friends') => {
    try {
      const response = await fetch(`/api/content?type=${type}`)
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  useEffect(() => {
    if (content.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % content.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [content.length])

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 5000)
  }, [])

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const currentContent = content[currentIndex]
  const currentGradient = gradients[currentIndex % gradients.length]

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return <Quote className="w-8 h-8" />
      case 'image':
        return <ImageIcon className="w-8 h-8" />
      case 'video':
        return <Video className="w-8 h-8" />
      case 'activity':
        return <Activity className="w-8 h-8" />
      default:
        return <Sparkles className="w-8 h-8" />
    }
  }

  return (
    <div className={`min-h-screen ${currentGradient} relative overflow-hidden`}>
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 0}
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
        />
      )}

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 200],
              x: [null, (Math.random() - 0.5) * 200],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Heart className="w-16 h-16 text-pink-300" fill="currentColor" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Happy New Year
          </h1>
          <p className="text-2xl text-white/90">
            {session.formData.name1} & {session.formData.name2}
          </p>
        </motion.div>

        {/* Content Display */}
        {currentContent && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 max-w-4xl w-full shadow-2xl border-2 border-white/30"
          >
            <div className="flex items-center gap-4 mb-6">
              {getIcon(currentContent.type)}
              <h2 className="text-2xl font-bold text-white capitalize">
                {currentContent.type}
              </h2>
            </div>

            <div className="text-white text-lg md:text-xl leading-relaxed whitespace-pre-line">
              {currentContent.content.replace(/\{name1\}/g, session.formData.name1)
                .replace(/\{name2\}/g, session.formData.name2)
                .replace(/\{relationship\}/g, session.formData.relationship || '')
                .replace(/\{memory\}/g, session.formData.favoriteMemory || '')
                .replace(/\{message\}/g, session.formData.message || '')}
            </div>

            {currentContent.imageUrl && (
              <div className="mt-6 rounded-lg overflow-hidden">
                <img
                  src={currentContent.imageUrl}
                  alt={currentContent.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {currentContent.videoUrl && (
              <div className="mt-6 rounded-lg overflow-hidden">
                <video
                  src={currentContent.videoUrl}
                  autoPlay
                  loop
                  muted
                  className="w-full h-auto"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation Dots */}
        <div className="flex gap-2 mt-8">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/')}
          className="mt-8 px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-lg font-semibold hover:bg-white/30 transition border-2 border-white/30"
        >
          Create New Wish
        </motion.button>
      </div>
    </div>
  )
}

