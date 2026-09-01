export type Lang = "en" | "hi"

const en = {
  govOfIndiaStyle: "Citizen Services • Digital India Initiative (Demo)",
  skipToContent: "Skip to main content",
  portalName: "NagrikSetu",
  tagline: "Digital Civic Issue Reporting & Community Problem Monitoring Portal",
  searchPlaceholder: "Search services, complaints, guidelines…",
  citizenLogin: "Citizen Login",
  adminLogin: "Admin Login",
  logout: "Logout",
  home: "Home",
  reportIssue: "Report Issue",
  trackComplaint: "Track Complaint",
  community: "Community Dashboard",
  survey: "Survey",
  guidelines: "Guidelines",
  about: "About",
  contact: "Contact",
  quickAccess: "Quick Access Services",
  popularServices: "Popular Civic Services",
  latestUpdates: "Latest Community Updates",
  awareness: "Awareness & Citizen Charter",
  statistics: "Portal at a Glance",
  faq: "Frequently Asked Questions",
  emergency: "Emergency Contact Numbers",
  heroTitle: "Report civic problems. Track resolution. Build a better city together.",
  heroBody:
    "NagrikSetu is a citizen-first platform to report local civic issues — from garbage and potholes to water supply and street lights — and monitor how your community's problems are being resolved.",
  language: "भाषा / Language",
} as const

const hi: Record<keyof typeof en, string> = {
  govOfIndiaStyle: "नागरिक सेवाएं • डिजिटल इंडिया पहल (डेमो)",
  skipToContent: "मुख्य सामग्री पर जाएं",
  portalName: "नागरिकसेतु",
  tagline: "डिजिटल नागरिक समस्या रिपोर्टिंग और सामुदायिक निगरानी पोर्टल",
  searchPlaceholder: "सेवाएं, शिकायतें, दिशानिर्देश खोजें…",
  citizenLogin: "नागरिक लॉगिन",
  adminLogin: "एडमिन लॉगिन",
  logout: "लॉग आउट",
  home: "मुखपृष्ठ",
  reportIssue: "शिकायत दर्ज करें",
  trackComplaint: "शिकायत ट्रैक करें",
  community: "सामुदायिक डैशबोर्ड",
  survey: "सर्वेक्षण",
  guidelines: "दिशानिर्देश",
  about: "परिचय",
  contact: "संपर्क",
  quickAccess: "त्वरित सेवाएं",
  popularServices: "लोकप्रिय नागरिक सेवाएं",
  latestUpdates: "नवीनतम सामुदायिक अपडेट",
  awareness: "जागरूकता और नागरिक चार्टर",
  statistics: "एक नज़र में पोर्टल",
  faq: "अक्सर पूछे जाने वाले प्रश्न",
  emergency: "आपातकालीन संपर्क नंबर",
  heroTitle: "नागरिक समस्याएं दर्ज करें। समाधान ट्रैक करें। मिलकर बेहतर शहर बनाएं।",
  heroBody:
    "नागरिकसेतु एक नागरिक-केंद्रित मंच है जहां आप स्थानीय नागरिक समस्याएं — कचरा, गड्ढे, जल आपूर्ति और स्ट्रीट लाइट — दर्ज कर सकते हैं।",
  language: "भाषा / Language",
}

export type TranslationKey = keyof typeof en

export const dictionary: Record<Lang, Record<TranslationKey, string>> = {
  en,
  hi,
}
