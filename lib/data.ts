import { ContentItem, UserType } from './types'
import { generateId } from './utils'

// Default content items
export const defaultContent: ContentItem[] = [
  {
    id: generateId(),
    type: 'quote',
    title: 'New Year Quote 1',
    content: 'May this New Year bring you happiness, peace, and prosperity. Wishing you a joyous year ahead!',
    category: ['couple', 'friends'],
    tags: ['inspirational', 'happy'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'shayri',
    title: 'New Year Shayri',
    content: 'Naya saal aaya hai, nayi ummeed le kar,\nKhushiyan aapke kadam chumein,\nHar pal aapke liye khushiyan laaye.',
    category: ['couple', 'friends'],
    tags: ['hindi', 'poetry'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'comedy',
    title: 'Funny New Year',
    content: 'New Year Resolution: I will not make any more New Year resolutions! 😂',
    category: ['friends'],
    tags: ['funny', 'humor'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'quote',
    title: 'Couple Quote',
    content: 'Together we will make this year the best one yet. Happy New Year, my love! 💕',
    category: ['couple'],
    tags: ['romantic', 'love'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'quote',
    title: 'Personalized Couple Quote',
    content: 'Dear {name1} and {name2}, as you celebrate {relationship} together, may this New Year bring you endless joy and beautiful memories! 💑',
    category: ['couple'],
    tags: ['romantic', 'personalized'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'shayri',
    title: 'Romantic Shayri',
    content: 'Naya saal aaya hai, aap dono ke liye,\n{name1} aur {name2} ke liye,\nHar pal khushiyan laaye, har din naya ho,\nAapka pyaar hamesha bana rahe.',
    category: ['couple'],
    tags: ['hindi', 'romantic', 'shayri'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'quote',
    title: 'Friends Quote',
    content: 'To {name1} and {name2}, friends for {relationship} - may this New Year strengthen our bond even more! 🎉',
    category: ['friends'],
    tags: ['friendship', 'personalized'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'comedy',
    title: 'Funny Friends',
    content: 'New Year Resolution for {name1} and {name2}: Let\'s promise to be even more awesome friends this year! (And maybe share more memes 😂)',
    category: ['friends'],
    tags: ['funny', 'humor', 'memes'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'activity',
    title: 'New Year Activity',
    content: 'Plan a surprise date night to celebrate the New Year together!',
    category: ['couple'],
    tags: ['activity', 'date'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'anime',
    title: 'Anime Character Wish',
    content: 'May your New Year be as exciting as an anime adventure! 🎌',
    category: ['friends'],
    tags: ['anime', 'fun'],
    enabled: true,
    createdAt: new Date().toISOString(),
  },
]

export function getContentByType(type: UserType, content: ContentItem[]): ContentItem[] {
  return content.filter(
    (item) => item.enabled && (item.category.includes(type) || item.category.length === 0)
  )
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

