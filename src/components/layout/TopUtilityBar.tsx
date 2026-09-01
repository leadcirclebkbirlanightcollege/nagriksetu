import { useEffect, useState } from "react"
import { useLanguage } from "../../context/LanguageContext"

type Scale = "normal" | "large" | "xlarge"

export default function TopUtilityBar() {
  const { lang, setLang, t } = useLanguage()
  const [scale, setScale] = useState<Scale>(
    () => (localStorage.getItem("ns_fontscale") as Scale) || "normal",
  )

  useEffect(() => {
    document.documentElement.dataset.fontscale = scale === "normal" ? "" : scale
    localStorage.setItem("ns_fontscale", scale)
  }, [scale])

  return (
    <div className="bg-navy-dark text-white">
      <div className="gov-container flex flex-wrap items-center justify-between gap-2 py-1.5 text-xs">
        <p className="font-medium tracking-wide text-white/90">{t("govOfIndiaStyle")}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" aria-label="Adjust text size">
            <span className="sr-only">Text size</span>
            <button
              onClick={() => setScale("normal")}
              className="rounded px-1.5 hover:bg-white/15"
              aria-pressed={scale === "normal"}
              title="Normal text size"
            >
              A
            </button>
            <button
              onClick={() => setScale("large")}
              className="rounded px-1.5 text-sm hover:bg-white/15"
              aria-pressed={scale === "large"}
              title="Larger text size"
            >
              A+
            </button>
            <button
              onClick={() => setScale("xlarge")}
              className="rounded px-1.5 text-base hover:bg-white/15"
              aria-pressed={scale === "xlarge"}
              title="Largest text size"
            >
              A++
            </button>
          </div>
          <div className="h-4 w-px bg-white/25" aria-hidden />
          <div className="flex items-center gap-1" role="group" aria-label={t("language")}>
            <button
              onClick={() => setLang("en")}
              className={`rounded px-2 py-0.5 ${lang === "en" ? "bg-saffron text-navy-dark font-semibold" : "hover:bg-white/15"}`}
              aria-pressed={lang === "en"}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`rounded px-2 py-0.5 ${lang === "hi" ? "bg-saffron text-navy-dark font-semibold" : "hover:bg-white/15"}`}
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
