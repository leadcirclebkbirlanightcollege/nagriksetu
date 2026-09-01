import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { db, UserRecord } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "nagriksetu-secure-production-jwt-key-2026"
const TOKEN_EXPIRY = "7d"

export interface AuthPayload {
  userId: string
  email: string
  role: "citizen" | "officer" | "admin" | "super_admin"
  name: string
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload
}

export function generateToken(user: UserRecord): string {
  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    return null
  }
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim()
  }
  return null
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req)
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please log in." })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." })
  }

  const user = db.getUserById(payload.userId)
  if (!user || user.status === "Suspended") {
    return res.status(403).json({ error: "Account is suspended or invalid." })
  }

  req.user = payload
  next()
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req)
  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      const user = db.getUserById(payload.userId)
      if (user && user.status !== "Suspended") {
        req.user = payload
      }
    }
  }
  next()
}

export function requireRole(roles: Array<"citizen" | "officer" | "admin" | "super_admin">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Unauthorized. Required access level not met." })
      }
      next()
    })
  }
}
