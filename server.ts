import express from "express"
import path from "path"
import cors from "cors"
import { createServer as createViteServer } from "vite"

import { authRouter } from "./server/routes/auth"
import { complaintsRouter } from "./server/routes/complaints"
import { analyticsRouter } from "./server/routes/analytics"
import { notificationsRouter } from "./server/routes/notifications"
import { feedbackRouter } from "./server/routes/feedback"
import { surveysRouter } from "./server/routes/surveys"
import { adminRouter } from "./server/routes/admin"
import { uploadRouter } from "./server/upload"

async function startServer() {
  const app = express()
  const PORT = 3000

  // Middlewares
  app.use(cors())
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true, limit: "10mb" }))

  // Static uploads directory
  const uploadsDir = path.join(process.cwd(), "uploads")
  app.use("/uploads", express.static(uploadsDir))

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "NagrikSetu Civic Backend",
      version: "2.0.0-production",
      time: new Date().toISOString(),
    })
  })

  // API Routes
  app.use("/api/auth", authRouter)
  app.use("/api/complaints", complaintsRouter)
  app.use("/api/analytics", analyticsRouter)
  app.use("/api/notifications", notificationsRouter)
  app.use("/api/feedback", feedbackRouter)
  app.use("/api/surveys", surveysRouter)
  app.use("/api/admin", adminRouter)
  app.use("/api", uploadRouter)

  // Global API error handler
  app.use("/api", (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API error:", err)
    res.status(500).json({ error: err.message || "An unexpected server error occurred." })
  })

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    })
    app.use(vite.middlewares)
  } else {
    const distPath = path.join(process.cwd(), "dist")
    app.use(express.static(distPath))
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"))
    })
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NagrikSetu Production Server is running on http://0.0.0.0:${PORT}`)
  })
}

startServer().catch((err) => {
  console.error("Fatal server boot failure:", err)
  process.exit(1)
})
