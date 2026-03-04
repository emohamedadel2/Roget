"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"
import { VaultDetail } from "@/components/vault-detail"
import { OnboardingChat } from "@/components/onboarding/onboarding-chat"
import { AuthProvider } from "@/components/auth/auth-context"
import { SignUpModal } from "@/components/auth/sign-up-modal"

type AppView = "landing" | "onboarding" | "dashboard" | "vault" | "chat"

export default function Home() {
  const [view, setView] = useState<AppView>("landing")
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null)
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>()
  const [chatTargetVaultId, setChatTargetVaultId] = useState<string | undefined>()
  const returnViewRef = useRef<AppView>("dashboard")

  // Landing CTA → guest onboarding (not dashboard)
  const handleEnterApp = (msg?: string) => {
    if (msg) setChatInitialMessage(msg)
    setView("onboarding")
  }

  // Onboarding complete (called after sign-up or "Take me to dashboard")
  const handleOnboardingComplete = () => {
    setView("dashboard")
  }

  const handleVaultSelect = (id: string) => {
    setActiveVaultId(id)
    setView("vault")
  }

  const handleBackToDashboard = () => {
    setActiveVaultId(null)
    setView("dashboard")
  }

  const handleStartChat = (initialMessage?: string, targetVaultId?: string) => {
    setChatInitialMessage(initialMessage)
    setChatTargetVaultId(targetVaultId)
    returnViewRef.current = view === "vault" ? "vault" : "dashboard"
    setView("chat")
  }

  const handleChatComplete = () => {
    setChatInitialMessage(undefined)
    setChatTargetVaultId(undefined)
    setView(returnViewRef.current)
  }

  return (
    <AuthProvider>
      <main className="overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <LandingPage onEnterApp={handleEnterApp} />
            </motion.div>
          )}
          {view === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <OnboardingChat
                onComplete={handleOnboardingComplete}
                initialMessage={chatInitialMessage}
                isGuest
              />
            </motion.div>
          )}
          {view === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Dashboard
                onVaultSelect={handleVaultSelect}
                onStartChat={handleStartChat}
              />
            </motion.div>
          )}
          {view === "vault" && activeVaultId && (
            <motion.div
              key="vault"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <VaultDetail
                vaultId={activeVaultId}
                onBack={handleBackToDashboard}
                onStartChat={handleStartChat}
              />
            </motion.div>
          )}
          {view === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <OnboardingChat
                onComplete={handleChatComplete}
                initialMessage={chatInitialMessage}
                targetVaultId={chatTargetVaultId}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global sign-up modal — rendered at root so it appears above everything */}
        <SignUpModal />
      </main>
    </AuthProvider>
  )
}
