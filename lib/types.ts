export type UserType = 'couple' | 'friends'

export interface FormData {
  name1: string
  name2: string
  relationship: string
  favoriteMemory?: string
  message?: string
  year?: string
  [key: string]: string | undefined
}

export interface ContentItem {
  id: string
  type: 'quote' | 'shayri' | 'comedy' | 'image' | 'video' | 'character' | 'anime' | 'activity'
  title: string
  content: string
  imageUrl?: string
  videoUrl?: string
  category: UserType[]
  tags: string[]
  enabled: boolean
  createdAt: string
}

export interface UserSession {
  id: string
  type: UserType
  formData: FormData
  createdAt: string
  expiresAt: string
}

