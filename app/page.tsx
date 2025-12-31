'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    setConfetti(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden gradient-bg-1">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {typeof window !== 'undefined' && [...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-yellow-300" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
            Happy New Year
          </h1>
          <p className="text-2xl md:text-3xl text-yellow-200 font-light">
            Create Beautiful Wishes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Couple Button */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/couple/form">
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center cursor-pointer border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-2xl">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <Heart className="w-20 h-20 text-pink-400 mx-auto" fill="currentColor" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">For Couples</h2>
                <p className="text-white/90 text-lg">
                  Create romantic New Year wishes with personalized questions
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Friends Button */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/friends/form">
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center cursor-pointer border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-2xl">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="mb-6"
                >
                  <Users className="w-20 h-20 text-blue-400 mx-auto" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">For Friends</h2>
                <p className="text-white/90 text-lg">
                  Share fun New Year wishes with your friend group
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <Link
            href="/admin"
            className="text-white/70 hover:text-white text-sm underline"
          >
            Admin Panel
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

