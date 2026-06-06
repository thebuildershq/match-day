import { type HTMLAttributes, type ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border border-line rounded-2xl shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}