'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Plus, Edit, Trash2, Save, X, 
  Quote, Image as ImageIcon, Video, 
  Activity, Sparkles, Lock, Unlock, Home, ArrowLeft
} from 'lucide-react'
import { ContentItem } from '@/lib/types'
import { generateId } from '@/lib/utils'

const contentTypes = [
  { value: 'quote', label: 'Quote', icon: Quote },
  { value: 'shayri', label: 'Shayri', icon: Sparkles },
  { value: 'comedy', label: 'Comedy', icon: Sparkles },
  { value: 'image', label: 'Image', icon: ImageIcon },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'character', label: 'Character', icon: Sparkles },
  { value: 'anime', label: 'Anime', icon: Sparkles },
  { value: 'activity', label: 'Activity', icon: Activity },
]

export default function AdminPanel() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState<ContentItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    type: 'quote',
    title: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    category: [],
    tags: [],
    enabled: true,
  })

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('adminAuth')
    if (authStatus === 'true') {
      setAuthenticated(true)
      fetchContent()
    }
  }, [])

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (data.authenticated) {
        setAuthenticated(true)
        sessionStorage.setItem('adminAuth', 'true')
        fetchContent()
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    }
  }

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content')
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
      } else {
        // Create new
        await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: generateId(),
            ...formData,
            createdAt: new Date().toISOString(),
          }),
        })
      }
      fetchContent()
      resetForm()
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await fetch(`/api/content?id=${id}`, { method: 'DELETE' })
      fetchContent()
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Failed to delete content')
    }
  }

  const handleEdit = (item: ContentItem) => {
    setFormData(item)
    setEditingId(item.id)
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      type: 'quote',
      title: '',
      content: '',
      imageUrl: '',
      videoUrl: '',
      category: [],
      tags: [],
      enabled: true,
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  const toggleCategory = (cat: 'couple' | 'friends') => {
    const categories = formData.category || []
    if (categories.includes(cat)) {
      setFormData({ ...formData, category: categories.filter((c) => c !== cat) })
    } else {
      setFormData({ ...formData, category: [...categories, cat] })
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen gradient-bg-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Enter password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>

          {/* Back to Home Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600">Manage your New Year wishes content</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Content
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('adminAuth')
                  setAuthenticated(false)
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Edit Content' : 'Add New Content'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  {contentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Use {name1}, {name2}, {relationship}, {memory}, {message} as placeholders"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Video URL</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.category?.includes('couple')}
                      onChange={() => toggleCategory('couple')}
                    />
                    Couple
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.category?.includes('friends')}
                      onChange={() => toggleCategory('friends')}
                    />
                    Friends
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(',').map((t) => t.trim()),
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  />
                  Enabled
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Items ({content.length})</h2>
          <div className="space-y-4">
            {content.map((item) => {
              const TypeIcon = contentTypes.find((t) => t.value === item.type)?.icon || Sparkles
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TypeIcon className="w-5 h-5 text-blue-500" />
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {item.type}
                        </span>
                        {item.enabled ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            Enabled
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">{item.content}</p>
                      <div className="flex gap-2 flex-wrap">
                        {item.category.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

