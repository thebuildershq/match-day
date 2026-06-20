import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional + conflicting Tailwind classes (last wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}