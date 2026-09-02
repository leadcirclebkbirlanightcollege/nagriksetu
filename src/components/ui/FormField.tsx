import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function Req() {
  return (
    <span className="text-govRed font-bold ml-0.5" aria-hidden="true">
      *
    </span>
  )
}

export function FieldError({ id, msg }: { id?: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-govRed">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{msg}</span>
    </p>
  )
}

export default function FormField({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = "",
}: FormFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={className}>
      <label htmlFor={id} className="gov-label">
        {label} {required ? <Req /> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mb-1 text-xs text-ink-light">
          {hint}
        </p>
      ) : null}
      {children}
      <FieldError id={errorId} msg={error} />
    </div>
  )
}
