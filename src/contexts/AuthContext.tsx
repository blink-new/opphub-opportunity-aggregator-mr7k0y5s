import { createContext, useEffect, useState, ReactNode } from 'react'
import { blink } from '@/blink/client'
import { User } from '@/types/user'

interface AuthContextType {
  user: any | null
  userProfile: User | null
  isLoading: boolean
  isAuthenticated: boolean
  updateUserProfile: (data: Partial<User>) => Promise<void>
  logout: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
      
      if (state.user) {
        // Fetch or create user profile
        try {
          const profiles = await blink.db.users.list({
            where: { userId: state.user.id },
            limit: 1
          })
          
          if (profiles.length > 0) {
            const profile = profiles[0]
            setUserProfile({
              ...profile,
              preferences: profile.preferences ? JSON.parse(profile.preferences) : {
                emailNotifications: true,
                deadlineReminders: true,
                categories: [],
                sources: [],
                theme: 'system'
              }
            })
          } else {
            // Create new user profile
            const newProfile = {
              id: `user_${Date.now()}`,
              userId: state.user.id,
              email: state.user.email || '',
              displayName: state.user.displayName || state.user.email?.split('@')[0] || 'User',
              preferences: JSON.stringify({
                emailNotifications: true,
                deadlineReminders: true,
                categories: [],
                sources: [],
                theme: 'system'
              })
            }
            
            await blink.db.users.create(newProfile)
            setUserProfile({
              ...newProfile,
              preferences: JSON.parse(newProfile.preferences)
            })
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
    })

    return unsubscribe
  }, [])

  const updateUserProfile = async (data: Partial<User>) => {
    if (!userProfile) return
    
    try {
      const updatedData = {
        ...data,
        preferences: data.preferences ? JSON.stringify(data.preferences) : undefined,
        updatedAt: new Date().toISOString()
      }
      
      await blink.db.users.update(userProfile.id, updatedData)
      
      setUserProfile(prev => prev ? {
        ...prev,
        ...data,
        updatedAt: new Date().toISOString()
      } : null)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  const logout = () => {
    blink.auth.logout()
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      isLoading,
      isAuthenticated: !!user,
      updateUserProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}