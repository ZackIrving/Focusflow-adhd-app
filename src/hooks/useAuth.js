import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authStatus, setAuthStatus] = useState(
    'Sign in or create an account to use FocusFlow.'
  )
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    async function getCurrentSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Session error:', error)
        setAuthStatus('Could not check login status.')
      }

      setUser(data?.session?.user || null)
      setIsAuthLoading(false)
    }

    getCurrentSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function signUp() {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthStatus('Enter an email and password first.')
      return
    }

    setAuthStatus('Creating account...')

    const { error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
    })

    if (error) {
      console.error('Sign up error:', error)
      setAuthStatus(error.message)
      return
    }

    setAuthStatus(
      'Account created. Check your email if Supabase asks for confirmation, then sign in.'
    )
  }

  async function signIn() {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthStatus('Enter an email and password first.')
      return
    }

    setAuthStatus('Signing in...')

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    })

    if (error) {
      console.error('Sign in error:', error)
      setAuthStatus(error.message)
      return
    }

    setAuthEmail('')
    setAuthPassword('')
    setAuthStatus('Signed in.')
  }

  async function signOut() {
    await supabase.auth.signOut()
    setAuthStatus('Signed out.')
  }

  return {
    user,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authStatus,
    isAuthLoading,
    signUp,
    signIn,
    signOut,
  }
}