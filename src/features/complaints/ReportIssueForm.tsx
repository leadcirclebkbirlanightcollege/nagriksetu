import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import {
  MapPin,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  FileText,
  Search,
  PlusCircle,
  X,
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"
import { ISSUE_CATEGORIES } from "../../types"
import { createComplaint } from "./api"
import FormField, { Req, FieldError } from "../../components/ui/FormField"

const schema = z.object({
  title: z.string().min(5, "Please enter a descriptive title (min 5 characters)").max(120),
  category: z.string().min(1, "Select a category"),
  description: z.string().min(15, "Please describe the issue (min 15 characters)").max(1500),
  area: z.string().min(2, "Enter the area or ward"),
  ward: z.string().max(120).optional().or(z.literal("")),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
  landmark: z.string().max(120).optional().or(z.literal("")),
  lat: z.number().optional(),
  lng: z.number().optional(),
  contactNumber: z
    .string()
    .regex(/^$|^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
  anonymous: z.boolean().optional(),
})

export type ReportFormValues = z.infer<typeof schema>

interface FileWithPreview {
  file: File
  preview: string
}

export default function ReportIssueForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { anonymous: false, category: "", priority: "Medium" },
  })

  const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>([])
  const [gpsMsg, setGpsMsg] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [result, setResult] = useState<{ id: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const lat = watch("lat")
  const lng = watch("lng")

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      filesWithPreview.forEach((f) => URL.revokeObjectURL(f.preview))
    }
  }, [filesWithPreview])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).slice(0, 5)
    // Revoke old previews
    filesWithPreview.forEach((f) => URL.revokeObjectURL(f.preview))

    const newFiles = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setFilesWithPreview(newFiles)
  }

  function removeFile(index: number) {
    setFilesWithPreview((prev) => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      setGpsMsg("Geolocation is not supported by this browser.")
      return
    }
    setLocating(true)
    setGpsMsg("Detecting your location…")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("lat", Number(pos.coords.latitude.toFixed(6)))
        setValue("lng", Number(pos.coords.longitude.toFixed(6)))
        setGpsMsg("Location coordinates captured successfully.")
        setLocating(false)
      },
      () => {
        setGpsMsg("Could not detect location. You can enter the area manually.")
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function onSubmit(values: ReportFormValues) {
    setError(null)
    try {
      const rawFiles = filesWithPreview.map((f) => f.file)
      const complaint = await createComplaint(values, rawFiles)
      setResult({ id: complaint.id })
      reset()
      filesWithPreview.forEach((f) => URL.revokeObjectURL(f.preview))
      setFilesWithPreview([])
      setGpsMsg(null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.")
    }
  }

  function copyComplaintId() {
    if (!result) return
    navigator.clipboard.writeText(result.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (result) {
    return (
      <div className="gov-card border-t-4 border-t-govGreen p-6 sm:p-10 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-govGreen-tint text-govGreen">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-navy">Complaint submitted successfully</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Your complaint has been registered with the municipal grievance portal. Please note your Complaint Reference ID:
        </p>
        <div className="my-5 inline-flex items-center gap-3 rounded-gov border border-line bg-surfaceAlt px-5 py-3 shadow-xs">
          <FileText className="h-5 w-5 text-navy shrink-0" aria-hidden="true" />
          <span className="font-mono text-xl font-extrabold tracking-wider text-navy">
            {result.id}
          </span>
          <button
            type="button"
            onClick={copyComplaintId}
            className="inline-flex items-center gap-1 rounded-gov border border-line bg-white px-2.5 py-1 text-xs font-bold text-navy hover:bg-surface transition-colors"
            title="Copy Complaint ID"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-govGreen" aria-hidden="true" />
                <span className="text-govGreen">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={`/track?q=${result.id}`} className="gov-btn-primary text-sm font-bold shadow-sm">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>Track this complaint</span>
          </a>
          <button
            type="button"
            className="gov-btn-outline text-sm font-bold shadow-xs"
            onClick={() => setResult(null)}
          >
            <PlusCircle className="h-4 w-4 text-navy" aria-hidden="true" />
            <span>Report another issue</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gov-card p-6 sm:p-8 shadow-card" noValidate>
      {error ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-gov border border-govRed-border bg-govRed-tint p-4 text-sm text-govRed-dark"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-govRed mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="space-y-8">
        {/* Section 1: Issue Classification & Details */}
        <div>
          <div className="flex items-center gap-2 border-b border-lineSubtle pb-2.5 mb-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
              1
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
              Grievance Classification & Details
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="gov-label">
                Issue Title <Req />
              </label>
              <input
                id="title"
                className="gov-input"
                placeholder="e.g. Overflowing garbage bin near market"
                {...register("title")}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              <FieldError id="title-error" msg={errors.title?.message} />
            </div>

            <div>
              <label htmlFor="category" className="gov-label">
                Category <Req />
              </label>
              <select
                id="category"
                className="gov-input"
                {...register("category")}
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? "category-error" : undefined}
              >
                <option value="">Select a category…</option>
                {ISSUE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <FieldError id="category-error" msg={errors.category?.message} />
            </div>

            <div>
              <label htmlFor="priority" className="gov-label">
                Priority
              </label>
              <select id="priority" className="gov-input" {...register("priority")}>
                <option value="Low">Low</option>
                <option value="Medium">Medium (Standard SLA)</option>
                <option value="High">High (48 Hours)</option>
                <option value="Critical">Critical (Emergency Hazard)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="gov-label">
                Description <Req />
              </label>
              <textarea
                id="description"
                rows={4}
                className="gov-input"
                placeholder="Describe the problem, since when it exists, and how it affects the area."
                {...register("description")}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "desc-error" : undefined}
              />
              <FieldError id="desc-error" msg={errors.description?.message} />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Landmark */}
        <div>
          <div className="flex items-center gap-2 border-b border-lineSubtle pb-2.5 mb-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
              2
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
              Incident Location Details
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="area" className="gov-label">
                Area / Ward <Req />
              </label>
              <input
                id="area"
                className="gov-input"
                placeholder="e.g. Ward 12 – Shivaji Nagar"
                {...register("area")}
                aria-invalid={!!errors.area}
                aria-describedby={errors.area ? "area-error" : undefined}
              />
              <FieldError id="area-error" msg={errors.area?.message} />
            </div>

            <div>
              <label htmlFor="ward" className="gov-label">
                Ward Number / Code
              </label>
              <input id="ward" className="gov-input" placeholder="e.g. Ward 12" {...register("ward")} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="landmark" className="gov-label">
                Nearby Landmark
              </label>
              <input id="landmark" className="gov-input" placeholder="e.g. Opposite City Hospital Gate 2" {...register("landmark")} />
            </div>

            {/* GPS Capture */}
            <div className="md:col-span-2 rounded-gov border border-line bg-surfaceAlt p-4">
              <span className="gov-label mb-2 block">Precise GPS Coordinates</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locating}
                  className="gov-btn-outline gap-1.5 py-1.5 px-3 text-xs font-semibold shadow-xs"
                >
                  {locating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-navy" aria-hidden="true" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-saffron" aria-hidden="true" />
                  )}
                  <span>{locating ? "Capturing location…" : "Use my current location"}</span>
                </button>
                {lat && lng ? (
                  <span className="rounded-gov bg-navy-tint border border-line px-2.5 py-1 text-xs font-bold text-navy">
                    Captured: {lat}, {lng}
                  </span>
                ) : null}
                {gpsMsg ? <span className="text-xs text-ink-muted">{gpsMsg}</span> : null}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Supporting Photographic Evidence */}
        <div>
          <div className="flex items-center gap-2 border-b border-lineSubtle pb-2.5 mb-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
              3
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
              Supporting Photographic Evidence
            </h3>
          </div>

          <div className="space-y-3">
            <label htmlFor="images" className="gov-label">
              Upload Images (Max 5 photos)
            </label>
            <div className="rounded-gov border border-dashed border-line bg-surface p-4 text-center">
              <UploadCloud className="mx-auto h-8 w-8 text-navy" aria-hidden="true" />
              <p className="mt-2 text-xs font-medium text-ink">
                Upload clear photos showing the problem and surrounding landmark.
              </p>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="mt-3 text-xs file:mr-3 file:rounded-gov file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-light cursor-pointer"
                onChange={handleFileChange}
              />
              <p className="mt-1.5 text-[11px] text-ink-light">JPG, PNG format up to 5MB each.</p>
            </div>

            {/* Upload preview thumbnails with individual removal */}
            {filesWithPreview.length > 0 ? (
              <div>
                <p className="text-xs font-bold text-navy mb-2">Selected Photo Attachments ({filesWithPreview.length}/5):</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {filesWithPreview.map((item, idx) => (
                    <div
                      key={item.preview}
                      className="group relative rounded-gov border border-line bg-white p-1 shadow-xs overflow-hidden"
                    >
                      <img
                        src={item.preview}
                        alt={`Attachment ${idx + 1}`}
                        className="h-24 w-full rounded-gov object-cover"
                      />
                      <div className="mt-1 flex items-center justify-between px-1">
                        <span className="max-w-[70px] truncate text-[10px] font-medium text-ink-muted">
                          {item.file.name}
                        </span>
                        <span className="text-[10px] text-ink-light">
                          {(item.file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-govRed text-white shadow-xs hover:bg-govRed-dark transition-colors"
                        aria-label={`Remove photo ${idx + 1}`}
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Section 4: Citizen Contact & Declaration */}
        <div>
          <div className="flex items-center gap-2 border-b border-lineSubtle pb-2.5 mb-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
              4
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
              Citizen Contact & Privacy
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="contactNumber" className="gov-label">
                Mobile Number for SMS Tracking Updates
              </label>
              <input
                id="contactNumber"
                inputMode="numeric"
                className="gov-input"
                placeholder="10-digit Indian mobile number"
                {...register("contactNumber")}
                aria-invalid={!!errors.contactNumber}
                aria-describedby={errors.contactNumber ? "contact-error" : undefined}
              />
              <FieldError id="contact-error" msg={errors.contactNumber?.message} />
            </div>

            <div className="flex items-center md:pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line text-navy focus:ring-navy"
                  {...register("anonymous")}
                />
                <span className="text-xs sm:text-sm font-medium text-ink">
                  Report anonymously (your contact details will not be shown on public dashboards)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-lineSubtle pt-5">
        <button
          type="submit"
          className="gov-btn-saffron gap-2 text-sm font-bold shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{isSubmitting ? "Submitting complaint…" : "Submit Complaint"}</span>
        </button>

        <button
          type="reset"
          className="gov-btn-outline gap-1.5 text-sm font-medium shadow-xs"
          onClick={() => {
            reset()
            filesWithPreview.forEach((f) => URL.revokeObjectURL(f.preview))
            setFilesWithPreview([])
            setGpsMsg(null)
          }}
        >
          <RotateCcw className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
          <span>Clear form</span>
        </button>
      </div>
    </form>
  )
}
