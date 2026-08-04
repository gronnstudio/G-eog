import type { Locale } from "@/lib/i18n"

/**
 * Small inline-SVG flags for the language picker, ported from the
 * Equilibrium reference build. Drawn as vector so they render identically
 * on every OS — emoji flags don't render at all on Windows. viewBox is a
 * 3:2 field.
 */

const STAR =
  "M0,-3 L0.68,-0.93 L2.85,-0.93 L1.09,0.36 L1.76,2.43 L0,1.15 L-1.76,2.43 L-1.09,0.36 L-2.85,-0.93 L-0.68,-0.93 Z"

const flags: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="4" />
      <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2.2" />
    </>
  ),
  nl: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.33" fill="#AE1C28" />
      <rect y="10.67" width="24" height="5.33" fill="#21468B" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="5.33" fill="#000" />
      <rect y="5.33" width="24" height="5.33" fill="#DD0000" />
      <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
    </>
  ),
  fr: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="8" height="16" fill="#0055A4" />
      <rect x="16" width="8" height="16" fill="#EF4135" />
    </>
  ),
  es: (
    <>
      <rect width="24" height="16" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
    </>
  ),
  pt: (
    <>
      <rect width="24" height="16" fill="#DA291C" />
      <rect width="9.6" height="16" fill="#046A38" />
      <circle cx="9.6" cy="8" r="2.4" fill="#FFE000" />
      <circle cx="9.6" cy="8" r="1.3" fill="#DA291C" />
    </>
  ),
  ru: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect y="5.33" width="24" height="5.33" fill="#0039A6" />
      <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
    </>
  ),
  zh: (
    <>
      <rect width="24" height="16" fill="#DE2910" />
      <g transform="translate(5.5,5) scale(0.95)" fill="#FFDE00">
        <path d={STAR} />
      </g>
      <g transform="translate(11,2.4) scale(0.34)" fill="#FFDE00">
        <path d={STAR} />
      </g>
      <g transform="translate(12.6,4.8) scale(0.34)" fill="#FFDE00">
        <path d={STAR} />
      </g>
      <g transform="translate(12.6,7.6) scale(0.34)" fill="#FFDE00">
        <path d={STAR} />
      </g>
      <g transform="translate(11,9.8) scale(0.34)" fill="#FFDE00">
        <path d={STAR} />
      </g>
    </>
  ),
  ja: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <circle cx="12" cy="8" r="4.4" fill="#BC002D" />
    </>
  ),
  hi: (
    <>
      <rect width="24" height="5.33" fill="#FF9933" />
      <rect y="5.33" width="24" height="5.33" fill="#fff" />
      <rect y="10.67" width="24" height="5.33" fill="#138808" />
      <circle cx="12" cy="8" r="1.9" fill="none" stroke="#000080" strokeWidth="0.5" />
    </>
  ),
  ar: (
    <>
      <rect width="24" height="16" fill="#006C35" />
      <rect x="4" y="9.4" width="16" height="0.9" fill="#fff" />
      <rect x="4" y="6" width="12" height="1.4" rx="0.7" fill="#fff" />
    </>
  ),
}

export function Flag({ code, className = "" }: { code: Locale; className?: string }) {
  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/15 ${className}`}
      aria-hidden
    >
      <svg width="20" height="13.3" viewBox="0 0 24 16" className="block">
        {flags[code]}
      </svg>
    </span>
  )
}
