import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { dictionary, type Lang, type TranslationKey } from "../i18n/strings"

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("ns_lang") as Lang) || "en"
  })

  useEffect(() => {
    localStorage.setItem("ns_lang", lang)
    document.documentElement.lang = lang === "hi" ? "hi" : "en"
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(() => setLangState((p) => (p === "en" ? "hi" : "en")), [])
  const t = useCallback(
    (key: TranslationKey) => dictionary[lang][key] ?? dictionary.en[key] ?? key,
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
