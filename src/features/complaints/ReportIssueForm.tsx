import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
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
} from "lucide-react"
import { ISSUE_CATEGORIES } from "../../types"
import { createComplaint } from "./api"

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

  const [files, setFiles] = useState<File[]>([])
  const [gpsMsg, setGpsMsg] = useState<string | null>(null)
  const [result, setResult] = useState<{ id: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const lat = watch("lat")
  const lng = watch("lng")

  function detectLocation() {
    if (!navigator.geolocation) {
      setGpsMsg("Geolocation is not supported by this browser.")
      return
    }
    setGpsMsg("Detecting your location…")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("lat", Number(pos.coords.latitude.toFixed(6)))
        setValue("lng", Number(pos.coords.longitude.toFixed(6)))
        setGpsMsg("Location captured.")
      },
      () => setGpsMsg("Could not detect location. You can enter the area manually."),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function onSubmit(values: ReportFormValues) {
    setError(null)
    try {
      const complaint = await createComplaint(values, files)
      setResult({ id: complaint.id })
      reset()
      setFiles([])
      setGpsMsg(null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.")
    }
  }

  if (result) {
    return (
      <div className="gov-card border-t-4 border-t-[#138808] p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5E9] text-[#138808]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-navy">Complaint submitted successfully</h2>
        <p className="mt-2 text-sm text-[#475569]">Please note your Complaint ID for tracking:</p>
        <div className="my-4 inline-flex items-center gap-2 rounded-gov border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-2.5">
          <FileText className="h-5 w-5 text-navy" />
          <span className="font-mono text-xl font-extrabold tracking-wider text-navy">
            {result.id}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href={`/track?q=${result.id}`} className="gov-btn-primary text-sm font-bold">
            <Search className="h-4 w-4" />
            Track this complaint
          </a>
          <button className="gov-btn-outline text-sm font-bold" onClick={() => setResult(null)}>
            <PlusCircle className="h-4 w-4" />
            Report another issue
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gov-card p-6 sm:p-8 shadow-sm" noValidate>
      {error ? (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-gov border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#DC2626]" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className="gov-label">Issue Title <Req /></label>
          <input
            id="title"
            className="gov-input"
            placeholder="e.g. Overflowing garbage bin near market"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          <FieldError msg={errors.title?.message} />
        </div>

        <div>
          <label htmlFor="category" className="gov-label">Category <Req /></label>
          <select id="category" className="gov-input" {...register("category")} aria-invalid={!!errors.category}>
            <option value="">Select a category…</option>
            {ISSUE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <FieldError msg={errors.category?.message} />
        </div>

        <div>
          <label htmlFor="contactNumber" className="gov-label">Contact Number</label>
          <input
            id="contactNumber"
            inputMode="numeric"
            className="gov-input"
            placeholder="10-digit mobile number"
            {...register("contactNumber")}
            aria-invalid={!!errors.contactNumber}
          />
          <FieldError msg={errors.contactNumber?.message} />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="gov-label">Description <Req /></label>
          <textarea
            id="description"
            rows={4}
            className="gov-input"
            placeholder="Describe the problem, since when it exists, and how it affects the area."
            {...register("description")}
            aria-invalid={!!errors.description}
          />
          <FieldError msg={errors.description?.message} />
        </div>

        <div>
          <label htmlFor="area" className="gov-label">Area / Ward <Req /></label>
          <input
            id="area"
            className="gov-input"
            placeholder="e.g. Ward 12 – Shivaji Nagar"
            {...register("area")}
            aria-invalid={!!errors.area}
          />
          <FieldError msg={errors.area?.message} />
        </div>

        <div>
          <label htmlFor="ward" className="gov-label">Ward</label>
          <input id="ward" className="gov-input" placeholder="e.g. Ward 12" {...register("ward")} />
        </div>

        <div>
          <label htmlFor="priority" className="gov-label">Priority</label>
          <select id="priority" className="gov-input" {...register("priority")}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div>
          <label htmlFor="landmark" className="gov-label">Landmark</label>
          <input id="landmark" className="gov-input" placeholder="Nearby landmark" {...register("landmark")} />
        </div>

        <div className="md:col-span-2 rounded-gov border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <span className="gov-label mb-2 block">GPS Location</span>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={detectLocation} className="gov-btn-outline gap-1.5 py-1.5 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5 text-[#E65100]" />
              Use my current location
            </button>
            {lat && lng ? (
              <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-xs font-semibold text-navy">
                Captured: {lat}, {lng}
              </span>
            ) : null}
            {gpsMsg ? <span className="text-xs text-[#64748B]">{gpsMsg}</span> : null}
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="images" className="gov-label">Upload Images</label>
          <div className="mt-1 flex flex-col gap-2">
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="gov-input py-2 file:mr-4 file:rounded file:border-0 file:bg-navy file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-light cursor-pointer"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
            />
            <p className="text-xs text-[#64748B]">Up to 5 images (JPG/PNG). Clear photos help resolve issues faster.</p>
          </div>
          {files.length > 0 ? (
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {files.map((f) => (
                <li key={f.name} className="inline-flex items-center gap-1.5 rounded border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs font-medium text-navy shadow-xs">
                  <UploadCloud className="h-3.5 w-3.5 text-[#0B3C6D]" />
                  {f.name}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="md:col-span-2 border-t border-[#E2E8F0] pt-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 rounded border-[#CBD5E1] text-navy focus:ring-navy" {...register("anonymous")} />
            <span className="text-sm font-medium text-[#334155]">Report anonymously (your identity will not be shown publicly)</span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-[#E2E8F0] pt-5">
        <button type="submit" className="gov-btn-saffron gap-2 text-sm font-bold shadow-sm" disabled={isSubmitting}>
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting…" : "Submit Complaint"}
        </button>
        <button
          type="reset"
          className="gov-btn-outline gap-1.5 text-sm font-medium"
          onClick={() => { reset(); setFiles([]); setGpsMsg(null) }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>
    </form>
  )
}

function Req() {
  return <span className="text-[#DC2626] font-bold" aria-hidden>*</span>
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1 text-xs font-medium text-[#DC2626]">{msg}</p>
}

