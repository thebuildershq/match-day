import { type HTMLAttributes, type ReactNode } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export function Badge({ className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-ink/5 text-ink ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}