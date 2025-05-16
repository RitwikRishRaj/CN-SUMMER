import React from 'react'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
