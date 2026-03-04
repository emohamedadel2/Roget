"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface AuthUser {
  name: string
  email: string
}

export type NudgeId =
  | "after-extraction"
  | "magic-moment"
  | "tab-overlay"
  | "second-vault"
  | "time-toast"
  | "keep-going-save"

interface AuthContextValue {
  isGuest: boolean
  user: AuthUser | null
  signUpModalOpen: boolean
  signUpModalReason: string | null
  openSignUpModal: (reason?: string) => void
  closeSignUpModal: () => void
  signUp: (user: AuthUser) => void
  signIn: (user: AuthUser) => void
  dismissedNudges: Set<NudgeId>
  dismissNudge: (id: NudgeId) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [signUpModalOpen, setSignUpModalOpen] = useState(false)
  const [signUpModalReason, setSignUpModalReason] = useState<string | null>(null)
  const [dismissedNudges, setDismissedNudges] = useState<Set<NudgeId>>(new Set())

  const openSignUpModal = useCallback((reason?: string) => {
    setSignUpModalReason(reason ?? null)
    setSignUpModalOpen(true)
  }, [])

  const closeSignUpModal = useCallback(() => {
    setSignUpModalOpen(false)
    setSignUpModalReason(null)
  }, [])

  const signUp = useCallback((newUser: AuthUser) => {
    setUser(newUser)
    setIsGuest(false)
    setSignUpModalOpen(false)
    setSignUpModalReason(null)
  }, [])

  const signIn = useCallback((existingUser: AuthUser) => {
    setUser(existingUser)
    setIsGuest(false)
    setSignUpModalOpen(false)
    setSignUpModalReason(null)
  }, [])

  const dismissNudge = useCallback((id: NudgeId) => {
    setDismissedNudges((prev) => new Set([...prev, id]))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isGuest,
        user,
        signUpModalOpen,
        signUpModalReason,
        openSignUpModal,
        closeSignUpModal,
        signUp,
        signIn,
        dismissedNudges,
        dismissNudge,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
