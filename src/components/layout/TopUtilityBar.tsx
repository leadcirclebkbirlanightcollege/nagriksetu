import { useEffect, useState } from "react"
import { Languages, Type, Contrast } from "lucide-react"
import { useLanguage } from "../../context/LanguageContext"

type Scale = "normal" | "large" | "xlarge"

export default function TopUtilityBar() {
  const { lang, setLang, t } = useLanguage()
  const [scale, setScale] = useState<Scale>(
    () => (localStorage.getItem("ns_fontscale") as Scale) || "normal",
  )
  const [highContrast, setHighContrast] = useState<boolean>(
    () => localStorage.getItem("ns_contrast") === "high",
  )

  useEffect(() => {
    document.documentElement.dataset.fontscale = scale === "normal" ? "" : scale
    localStorage.setItem("ns_fontscale", scale)
  }, [scale])

  useEffect(() => {
    if (highContrast) {
      document.documentElement.dataset.contrast = "high"
      localStorage.setItem("ns_contrast", "high")
    } else {
      delete document.documentElement.dataset.contrast
      localStorage.removeItem("ns_contrast")
    }
  }, [highContrast])

  return (
    <div className="border-b border-[#082B4E] bg-[#051C33] text-white">
      {/* Skip-to-content accessible link */}
      <a href="#main" className="skip-link">
        {t("skipToContent") || "Skip to main content"}
      </a>

      <div className="gov-container flex flex-wrap items-center justify-between gap-2 py-1.5 text-[11px] font-medium">
        {/* Official civic banner */}
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-govGreen shrink-0" aria-hidden="true" />
          <p className="tracking-wide text-white/90">{t("govOfIndiaStyle")}</p>
        </div>

        {/* Accessibility & Language utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Contrast mode toggle */}
          <button
            onClick={() => setHighContrast((v) => !v)}
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] transition-colors ${
              highContrast ? "bg-white text-navy font-bold shadow-xs" : "text-white/80 hover:bg-white/10"
            }`}
            aria-pressed={highContrast}
            title="Toggle high-contrast display"
          >
            <Contrast className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Text size adjustments */}
          <div className="flex items-center gap-1 border-l border-r border-white/20 px-2 sm:px-3" aria-label="Adjust text size">
            <Type className="mr-0.5 h-3 w-3 text-white/70" aria-hidden="true" />
            <span className="sr-only">Text size options:</span>
            <button
              onClick={() => setScale("normal")}
              className={`rounded px-1.5 py-0.5 transition-colors ${
                scale === "normal" ? "bg-white/25 font-bold text-white shadow-xs" : "text-white/75 hover:bg-white/10"
              }`}
              aria-pressed={scale === "normal"}
              title="Standard text size"
            >
              A
            </button>
            <button
              onClick={() => setScale("large")}
              className={`rounded px-1.5 py-0.5 font-bold transition-colors ${
                scale === "large" ? "bg-white/25 text-white shadow-xs" : "text-white/75 hover:bg-white/10"
              }`}
              aria-pressed={scale === "large"}
              title="Large text size"
            >
              A+
            </button>
            <button
              onClick={() => setScale("xlarge")}
              className={`rounded px-1.5 py-0.5 font-extrabold transition-colors ${
                scale === "xlarge" ? "bg-white/25 text-white shadow-xs" : "text-white/75 hover:bg-white/10"
              }`}
              aria-pressed={scale === "xlarge"}
              title="Largest text size"
            >
              A++
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1" role="group" aria-label={t("language")}>
            <Languages className="mr-0.5 h-3 w-3 text-white/70" aria-hidden="true" />
            <button
              onClick={() => setLang("en")}
              className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
                lang === "en" ? "bg-saffron text-white font-bold shadow-xs" : "text-white/80 hover:bg-white/10"
              }`}
              aria-pressed={lang === "en"}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
                lang === "hi" ? "bg-saffron text-white font-bold shadow-xs" : "text-white/80 hover:bg-white/10"
              }`}
              aria-pressed={lang === "hi"}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
