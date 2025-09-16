'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: unknown }>
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: unknown }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: unknown }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Please check your environment variables.') }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Please check your environment variables.') }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return { error }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          ...userData,
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        return { error: profileError }
      }
    }

    return { error: null }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }
    if (!supabase) return { error: new Error('Supabase is not configured') }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Role-based access control hooks
export function useRequireAuth(requiredRole?: Profile['role']) {
  const { user, profile, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/signin'
    }
    
    if (!loading && requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin') {
      window.location.href = '/unauthorized'
    }
  }, [user, profile, loading, requiredRole])
  
  return { user, profile, loading }
}

export function useIsAdmin() {
  const { profile } = useAuth()
  return profile?.role === 'admin'
}

export function useIsTeacher() {
  const { profile } = useAuth()
  return profile?.role === 'teacher' || profile?.role === 'admin'
}

export function useIsStudent() {
  const { profile } = useAuth()
  return profile?.role === 'student'
}

export function useIsParent() {
  const { profile } = useAuth()
  return profile?.role === 'parent'
}

export function useCanAccess(allowedRoles: Profile['role'][]) {
  const { profile } = useAuth()
  return profile ? allowedRoles.includes(profile.role) || profile.role === 'admin' : false
}
