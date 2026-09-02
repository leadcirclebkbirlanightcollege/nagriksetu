import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return ctx
}

const styles: Record<ToastType, { bg: string; border: string; text: string; icon: typeof CheckCircle2 }> = {
  success: {
    bg: "bg-[#F0FDF4]",
    border: "border-[#BBF7D0]",
    text: "text-[#166534]",
    icon: CheckCircle2,
  },
  error: {
    bg: "bg-[#FEF2F2]",
    border: "border-[#FECACA]",
    text: "text-[#991B1B]",
    icon: AlertCircle,
  },
  warning: {
    bg: "bg-[#FFF7ED]",
    border: "border-[#FED7AA]",
    text: "text-[#9A3412]",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-[#EFF6FF]",
    border: "border-[#BFDBFE]",
    text: "text-[#1E40AF]",
    icon: Info,
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration)
      }
    },
    [removeToast],
  )

  const success = useCallback((msg: string) => showToast(msg, "success"), [showToast])
  const error = useCallback((msg: string) => showToast(msg, "error"), [showToast])
  const warning = useCallback((msg: string) => showToast(msg, "warning"), [showToast])
  const info = useCallback((msg: string) => showToast(msg, "info"), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex max-w-md flex-col gap-2 pointer-events-none px-4 sm:px-0 w-full sm:w-auto"
      >
        {toasts.map((toast) => {
          const style = styles[toast.type]
          const Icon = style.icon
          return (
            <div
              key={toast.id}
              role={toast.type === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex items-start gap-3 rounded-gov border p-3.5 shadow-md transition-all duration-200 ${style.bg} ${style.border} ${style.text}`}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs sm:text-sm font-semibold leading-snug flex-1">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded p-0.5 hover:bg-black/5 focus:outline-none"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
