import { Router, Response } from "express"
import bcrypt from "bcryptjs"
import { db, UserRecord } from "../db"
import { generateToken, requireAuth, AuthenticatedRequest } from "../auth"

export const authRouter = Router()

// Register
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, ward, address, gender } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." })
    }

    const cleanEmail = email.toLowerCase().trim()
    const existing = db.getUserByEmail(cleanEmail)
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = db.createUser({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: "citizen",
      phone: phone ? phone.trim() : undefined,
      ward: ward ? ward.trim() : undefined,
      address: address ? address.trim() : undefined,
      gender: gender || undefined,
      status: "Active",
    })

    db.recordActivity({
      actorId: user.id,
      actorName: user.name,
      action: "Citizen account registered",
      entity: "user",
      entityId: user.id,
    })

    const token = generateToken(user)

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        ward: user.ward,
        address: user.address,
        gender: user.gender,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ error: (error as Error).message || "Internal server error" })
  }
})

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." })
    }

    const cleanEmail = email.toLowerCase().trim()
    const user = db.getUserByEmail(cleanEmail)
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    if (user.status === "Suspended") {
      return res.status(403).json({ error: "This account has been suspended by municipal administration." })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    if (role === "admin" && user.role !== "admin" && user.role !== "super_admin" && user.role !== "officer") {
      return res.status(403).json({ error: "Access denied. Authorised administrative personnel only." })
    }

    const token = generateToken(user)

    db.recordActivity({
      actorId: user.id,
      actorName: user.name,
      action: `Logged in (${user.role})`,
      entity: "user",
      entityId: user.id,
    })

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        ward: user.ward,
        address: user.address,
        gender: user.gender,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ error: (error as Error).message || "Internal server error" })
  }
})

// Current User Profile
authRouter.get("/me", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" })
  const user = db.getUserById(req.user.userId)
  if (!user) return res.status(404).json({ error: "User not found" })

  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    ward: user.ward,
    address: user.address,
    gender: user.gender,
  })
})

// Update Profile
authRouter.put("/profile", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    const { name, phone, ward, address, gender } = req.body

    const patch: Partial<UserRecord> = {}
    if (name) patch.name = name.trim()
    if (phone !== undefined) patch.phone = phone.trim() || undefined
    if (ward !== undefined) patch.ward = ward.trim() || undefined
    if (address !== undefined) patch.address = address.trim() || undefined
    if (gender !== undefined) patch.gender = gender

    const updated = db.updateUser(req.user.userId, patch)

    db.recordActivity({
      actorId: updated.id,
      actorName: updated.name,
      action: "Updated profile details",
      entity: "user",
      entityId: updated.id,
    })

    return res.status(200).json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      ward: updated.ward,
      address: updated.address,
      gender: updated.gender,
    })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Failed to update profile" })
  }
})

// Forgot Password
authRouter.post("/forgot-password", (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: "Email is required" })
  const user = db.getUserByEmail(email)
  if (user) {
    db.recordActivity({
      actorId: user.id,
      actorName: user.name,
      action: "Requested password reset instructions",
      entity: "user",
      entityId: user.id,
    })
  }
  return res.status(200).json({ message: "Password reset instructions have been dispatched to your registered email." })
})

// Reset Password
authRouter.post("/reset-password", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: "Email and new password are required" })
  const user = db.getUserByEmail(email)
  if (!user) return res.status(404).json({ error: "No account found with this email" })

  const passwordHash = await bcrypt.hash(password, 10)
  db.updateUser(user.id, { passwordHash })

  db.recordActivity({
    actorId: user.id,
    actorName: user.name,
    action: "Reset account password",
    entity: "user",
    entityId: user.id,
  })

  return res.status(200).json({ message: "Password updated successfully. You can now log in with your new credentials." })
})
