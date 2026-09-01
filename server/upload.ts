import multer from "multer"
import path from "path"
import fs from "fs"
import { Request, Response, Router } from "express"

const UPLOADS_DIR = path.join(process.cwd(), "uploads")

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg"
    const uniqueName = `civic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`
    cb(null, uniqueName)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file format. Only JPEG, PNG, WEBP and GIF images are allowed."))
  }
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB per file
    files: 5, // max 5 images
  },
})

export const uploadRouter = Router()

uploadRouter.post("/upload", uploadMiddleware.array("images", 5), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No image files uploaded" })
    }

    const urls = files.map((file) => `/uploads/${file.filename}`)
    return res.status(200).json({ urls, count: urls.length })
  } catch (error) {
    console.error("Upload error:", error)
    return res.status(500).json({ error: (error as Error).message || "Failed to upload images" })
  }
})
