'use client'

import React from 'react'

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function ApprovePageButton({
  children,
  className = '',
  ...props
}: CustomButtonProps) {
  return (
    <button
      className={`flex flex-row items-center justify-center w-[249.25px] h-10 rounded-lg px-2.5 gap-2.5 bg-[#FF9500] text-white  transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
