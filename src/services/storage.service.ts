// Supabase Storage: validated image uploads for complaints.
import { requireSupabase } from "../lib/supabase"
import { validateImage } from "../lib/validation"

const BUCKET = "complaint-images"

export interface UploadedImage {
  path: string
  url: string
}

function extensionFor(file: File): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }
  return map[file.type] ?? "jpg"
}

export const storageService = {
  /** Validates then uploads one image, returning its storage path + public URL. */
  async uploadComplaintImage(complaintId: string, file: File): Promise<UploadedImage> {
    const problem = validateImage(file)
    if (problem) throw new Error(problem)
    const db = requireSupabase()
    const name = crypto.randomUUID() + "." + extensionFor(file)
    const path = complaintId + "/" + name
    const up = await db.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    })
    if (up.error) throw new Error(up.error.message)
    const pub = db.storage.from(BUCKET).getPublicUrl(path)
    return { path, url: pub.data.publicUrl }
  },

  async uploadMany(complaintId: string, files: File[]): Promise<UploadedImage[]> {
    const out: UploadedImage[] = []
    for (const f of files) {
      out.push(await this.uploadComplaintImage(complaintId, f))
    }
    return out
  },
}
