import { useState, useEffect, useCallback } from 'react'
import { blink } from '@/blink/client'
import { Bookmark } from '@/types/user'
import { useAuth } from '@/hooks/useAuth'

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBookmarks = useCallback(async () => {
    if (!user?.id) {
      setBookmarks([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const bookmarkList = await blink.db.bookmarks.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setBookmarks(bookmarkList)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const addBookmark = async (
    opportunityId: string, 
    opportunityTitle: string, 
    opportunitySource: string,
    opportunityCategory: string,
    opportunityDeadline?: string
  ) => {
    if (!user?.id) return

    try {
      const bookmark = {
        id: `bookmark_${Date.now()}`,
        userId: user.id,
        opportunityId,
        opportunityTitle,
        opportunitySource,
        opportunityCategory,
        opportunityDeadline: opportunityDeadline || null
      }

      await blink.db.bookmarks.create(bookmark)
      setBookmarks(prev => [bookmark, ...prev])
      return bookmark
    } catch (error) {
      console.error('Error adding bookmark:', error)
      throw error
    }
  }

  const removeBookmark = async (opportunityId: string) => {
    if (!user?.id) return

    try {
      const bookmark = bookmarks.find(b => b.opportunityId === opportunityId)
      if (bookmark) {
        await blink.db.bookmarks.delete(bookmark.id)
        setBookmarks(prev => prev.filter(b => b.opportunityId !== opportunityId))
      }
    } catch (error) {
      console.error('Error removing bookmark:', error)
      throw error
    }
  }

  const isBookmarked = (opportunityId: string) => {
    return bookmarks.some(b => b.opportunityId === opportunityId)
  }

  const toggleBookmark = async (
    opportunityId: string,
    opportunityTitle: string,
    opportunitySource: string,
    opportunityCategory: string,
    opportunityDeadline?: string
  ) => {
    if (isBookmarked(opportunityId)) {
      await removeBookmark(opportunityId)
    } else {
      await addBookmark(opportunityId, opportunityTitle, opportunitySource, opportunityCategory, opportunityDeadline)
    }
  }

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    refetch: fetchBookmarks
  }
}