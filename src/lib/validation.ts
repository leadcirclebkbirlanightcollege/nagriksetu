// Validation, sanitisation and client-side safety helpers.
import { z } from "zod"
import { ISSUE_CATEGORIES, PRIORITIES } from "../types"

// ---- XSS: strip HTML tags / angle brackets from free text ------------
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim()
}

const safeString = (min: number, max: number) =>
  z
    .string()
    .transform((v) => sanitizeText(v))
    .pipe(z.string().min(min).max(max))

// ---- Auth schemas ----------------------------------------------------
export const emailSchema = z.string().email("Enter a valid email")
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72)

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: safeString(2, 80),
  email: emailSchema,
  phone: z
    .string()
    .regex(/^[0-9]{10}$/g, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  password: passwordSchema,
})

// ---- Complaint schema ------------------------------------------------
export const complaintSchema = z.object({
  title: safeString(5, 120),
  category: z.enum(ISSUE_CATEGORIES as [string, ...string[]]),
  description: safeString(10, 2000),
  area: safeString(2, 120),
  ward: z.string().max(120).optional().or(z.literal("")),
  landmark: z.string().max(160).optional().or(z.literal("")),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  priority: z.enum(PRIORITIES as [string, ...string[]]).default("Medium"),
  contactNumber: z
    .string()
    .regex(/^[0-9]{10}$/g, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  anonymous: z.boolean().default(false),
})
export type ComplaintInput = z.infer<typeof complaintSchema>

// ---- Feedback schema -------------------------------------------------
export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional().or(z.literal("")),
  suggestion: z.string().max(1000).optional().or(z.literal("")),
})

// ---- Image validation ------------------------------------------------
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB
export const MAX_IMAGES = 5

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG or WebP images are allowed."
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Each image must be 5 MB or smaller."
  }
  return null
}

// ---- Simple client-side rate limiter (per-key, localStorage) ---------
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  if (typeof window === "undefined") return true
  const now = Date.now()
  const storeKey = "ns_rl_" + key
  let hits: number[] = []
  try {
    hits = JSON.parse(localStorage.getItem(storeKey) ?? "[]")
  } catch {
    hits = []
  }
  hits = hits.filter((t) => now - t < windowMs)
  if (hits.length >= max) return false
  hits.push(now)
  localStorage.setItem(storeKey, JSON.stringify(hits))
  return true
}
