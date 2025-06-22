"use client"

import { useState, useRef, useEffect, createContext, useContext } from "react"

// Context for dropdown state
const DropdownContext = createContext()

// Main DropdownMenu component
export function DropdownMenu({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false)

  const toggleOpen = (newState) => {
    const nextState = newState !== undefined ? newState : !isOpen
    setIsOpen(nextState)
    if (onOpenChange) {
      onOpenChange(nextState)
    }
  }

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ isOpen, toggleOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  )
}

// Trigger component
export function DropdownMenuTrigger({ children, asChild, ...props }) {
  const { toggleOpen } = useContext(DropdownContext)

  const handleClick = (e) => {
    e.preventDefault()
    toggleOpen()
  }

  if (asChild) {
    return (
      <div onClick={handleClick} {...props}>
        {children}
      </div>
    )
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

// Content component
export function DropdownMenuContent({ children, align = "center", className = "", ...props }) {
  const { isOpen, toggleOpen } = useContext(DropdownContext)
  const contentRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        toggleOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        toggleOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, toggleOpen])

  if (!isOpen) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  }

  const alignClass = alignmentClasses[align] || alignmentClasses.center

  return (
    <div
      ref={contentRef}
      className={`absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Menu Item component
export function DropdownMenuItem({ children, onClick, className = "", ...props }) {
  const { toggleOpen } = useContext(DropdownContext)

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    toggleOpen(false)
  }

  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
}
