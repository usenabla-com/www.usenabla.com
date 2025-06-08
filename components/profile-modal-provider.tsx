'use client'

import { useState, useEffect } from 'react'
import ProfileSignupModal from './profile-signup-modal'

export default function ProfileModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Listen for the custom event from the layout script
    const handleOpenModal = () => {
      setIsModalOpen(true)
    }

    window.addEventListener('openProfileModal', handleOpenModal)

    return () => {
      window.removeEventListener('openProfileModal', handleOpenModal)
    }
  }, [])

  return (
    <>
      {children}
      <ProfileSignupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 