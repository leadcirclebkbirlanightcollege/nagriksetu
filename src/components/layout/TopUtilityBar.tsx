import { useEffect, useState } from "react"
import { Languages, Type } from "lucide-react"
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
    <div className="border-b border-[#082B4E] bg-[#051C33] text-white">
      <div className="gov-container flex flex-wrap items-center justify-between gap-2 py-1 text-[11px] font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#138808]" aria-hidden />
          <p className="tracking-wide text-white/90">{t("govOfIndiaStyle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-r border-white/20 pr-3" aria-label="Adjust text size">
            <Type className="mr-1 h-3 w-3 text-white/70" aria-hidden />
            <span className="sr-only">Text size</span>
            <button
              onClick={() => setScale("normal")}
              className={`rounded px-1.5 py-0.5 transition-colors ${scale === "normal" ? "bg-white/20 font-bold text-white" : "text-white/75 hover:bg-white/10"}`}
              aria-pressed={scale === "normal"}
              title="Normal text size"
            >
              A
            </button>
            <button
              onClick={() => setScale("large")}
              className={`rounded px-1.5 py-0.5 font-bold transition-colors ${scale === "large" ? "bg-white/20 text-white" : "text-white/75 hover:bg-white/10"}`}
              aria-pressed={scale === "large"}
              title="Larger text size"
            >
              A+
            </button>
            <button
              onClick={() => setScale("xlarge")}
              className={`rounded px-1.5 py-0.5 font-extrabold transition-colors ${scale === "xlarge" ? "bg-white/20 text-white" : "text-white/75 hover:bg-white/10"}`}
              aria-pressed={scale === "xlarge"}
              title="Largest text size"
            >
              A++
            </button>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label={t("language")}>
            <Languages className="mr-1 h-3 w-3 text-white/70" aria-hidden />
            <button
              onClick={() => setLang("en")}
              className={`rounded px-2 py-0.5 transition-colors ${lang === "en" ? "bg-[#E65100] text-white font-bold shadow-xs" : "text-white/80 hover:bg-white/10"}`}
              aria-pressed={lang === "en"}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`rounded px-2 py-0.5 transition-colors ${lang === "hi" ? "bg-[#E65100] text-white font-bold shadow-xs" : "text-white/80 hover:bg-white/10"}`}
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

