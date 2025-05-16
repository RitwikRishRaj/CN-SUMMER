import React from 'react'

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">CN-SUMMER</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
              Dashboard
            </button>
            <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
              Analytics
            </button>
            <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
              Settings
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
