"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookPlus,
  Check,
  Copy,
  ExternalLink,
  Languages,
  Link2,
  PencilLine,
} from "lucide-react"

import { useT } from "@/components/language-provider"
import { SectionLabel } from "@/components/ui/badges"
import { CATEGORIES } from "@/lib/knowledge"
import { repoUrl } from "@/lib/brand"

const GH_NEW_ISSUE = repoUrl("issues/new")

type Kind = "new-article" | "improve-article" | "translation" | "source-suggestion"

const KINDS: {
  id: Kind
  icon: typeof PencilLine
  label: { en: string; nl: string }
  body: { en: string; nl: string }
  ghLabel: string
}[] = [
  {
    id: "new-article",
    icon: BookPlus,
    label: { en: "New article", nl: "Nieuw artikel" },
    body: {
      en: "Propose a topic the ecosystem is missing.",
      nl: "Stel een onderwerp voor dat het ecosysteem nog mist.",
    },
    ghLabel: "new-article",
  },
  {
    id: "improve-article",
    icon: PencilLine,
    label: { en: "Improve an article", nl: "Artikel verbeteren" },
    body: {
      en: "Fix, expand or update an existing article.",
      nl: "Corrigeer, verrijk of actualiseer een bestaand artikel.",
    },
    ghLabel: "improvement",
  },
  {
    id: "translation",
    icon: Languages,
    label: { en: "Translation", nl: "Vertaling" },
    body: {
      en: "Help bring an article into another language.",
      nl: "Help een artikel naar een andere taal te brengen.",
    },
    ghLabel: "translation",
  },
  {
    id: "source-suggestion",
    icon: Link2,
    label: { en: "Source suggestion", nl: "Bronsuggestie" },
    body: {
      en: "Share research or references worth citing.",
      nl: "Deel onderzoek of referenties die het citeren waard zijn.",
    },
    ghLabel: "sources",
  },
]

export function ContributeWizard() {
  const t = useT()
  const [step, setStep] = useState(0)
  const [kind, setKind] = useState<Kind | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [summary, setSummary] = useState("")
  const [sources, setSources] = useState("")
  const [copied, setCopied] = useState(false)

  const kindMeta = KINDS.find((k) => k.id === kind)

  const issueTitle = useMemo(() => {
    const prefix =
      kind === "new-article"
        ? "[New article]"
        : kind === "improve-article"
          ? "[Improve]"
          : kind === "translation"
            ? "[Translation]"
            : "[Sources]"
    return `${prefix} ${title}`.trim()
  }, [kind, title])

  const issueBody = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === category)
    const sourceList = sources
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `- ${s}`)
      .join("\n")
    return [
      "## Contribution proposal",
      "",
      `**Type:** ${kindMeta?.label.en ?? ""}`,
      `**Title:** ${title}`,
      `**Category:** ${cat ? cat.title : category}`,
      "",
      "### Summary / why it matters",
      "",
      summary || "_(not provided)_",
      "",
      "### Sources",
      "",
      sourceList || "_(none yet)_",
      "",
      "---",
      "_Submitted via the Equilibrium contributor wizard._",
    ].join("\n")
  }, [kindMeta, title, category, summary, sources])

  const issueUrl = useMemo(() => {
    const params = new URLSearchParams({
      title: issueTitle,
      body: issueBody,
      labels: `contribution,${kindMeta?.ghLabel ?? "contribution"}`,
    })
    return `${GH_NEW_ISSUE}?${params.toString()}`
  }, [issueTitle, issueBody, kindMeta])

  const canNext = step === 0 ? kind !== null : step === 1 ? title.trim().length > 0 && category : true

  async function copyBody() {
    try {
      await navigator.clipboard.writeText(`${issueTitle}\n\n${issueBody}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const stepLabels = [
    t({ en: "Type", nl: "Type" }),
    t({ en: "Details", nl: "Details" }),
    t({ en: "Preview", nl: "Voorbeeld" }),
  ]

  const inputClass =
    "w-full rounded-xl border border-line bg-surface/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:border-accent"

  return (
    <div className="rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
        {stepLabels.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                i === step
                  ? "border-gronn-green bg-gronn-green text-gronn-white"
                  : i < step
                    ? "border-gronn-green text-gronn-green"
                    : "border-line text-faint"
              }`}
            >
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className={i === step ? "text-foreground" : "text-faint"}>{label}</span>
            {i < stepLabels.length - 1 && <span className="h-px w-6 bg-line" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <fieldset>
          <legend className="mb-4 font-heading text-2xl text-foreground">
            {t({ en: "What would you like to contribute?", nl: "Wat wil je bijdragen?" })}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {KINDS.map((k) => (
              <label
                key={k.id}
                className={`group cursor-pointer rounded-2xl border p-5 transition-colors ${
                  kind === k.id
                    ? "border-gronn-green bg-surface-2"
                    : "border-line bg-surface/40 hover:bg-surface-2"
                }`}
              >
                <input
                  type="radio"
                  name="contribution-kind"
                  value={k.id}
                  checked={kind === k.id}
                  onChange={() => setKind(k.id)}
                  className="sr-only"
                />
                <k.icon className="h-6 w-6 text-accent" />
                <p className="mt-3 font-heading text-xl text-foreground">{t(k.label)}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t(k.body)}</p>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div className="grid gap-5">
          <div>
            <label htmlFor="cw-title" className="mb-2 block text-sm font-medium text-foreground">
              {t({ en: "Title", nl: "Titel" })}
            </label>
            <input
              id="cw-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t({ en: "e.g. Riparian buffer zones", nl: "bijv. Oeverbufferzones" })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="cw-category" className="mb-2 block text-sm font-medium text-foreground">
              {t({ en: "Category", nl: "Categorie" })}
            </label>
            <select
              id="cw-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">{t({ en: "Choose a category…", nl: "Kies een categorie…" })}</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cw-summary" className="mb-2 block text-sm font-medium text-foreground">
              {t({ en: "Summary — why it matters", nl: "Samenvatting — waarom het ertoe doet" })}
            </label>
            <textarea
              id="cw-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              placeholder={t({
                en: "A few sentences on what this adds to the ecosystem.",
                nl: "Een paar zinnen over wat dit toevoegt aan het ecosysteem.",
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="cw-sources" className="mb-2 block text-sm font-medium text-foreground">
              {t({ en: "Source links (one per line)", nl: "Bronlinks (één per regel)" })}
            </label>
            <textarea
              id="cw-sources"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              rows={3}
              placeholder="https://…"
              className={`${inputClass} font-mono text-xs`}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <SectionLabel>{t({ en: "Preview", nl: "Voorbeeld" })}</SectionLabel>
          <div className="rounded-xl border border-line bg-surface/60 p-5">
            <p className="font-heading text-xl text-foreground">{issueTitle}</p>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted">
              {issueBody}
            </pre>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gronn-green px-6 py-3 font-medium text-gronn-white transition-transform hover:scale-[1.02]"
            >
              <ExternalLink className="h-4 w-4" />
              {t({ en: "Open GitHub issue", nl: "GitHub-issue openen" })}
            </a>
            <button
              type="button"
              onClick={copyBody}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              {copied
                ? t({ en: "Copied", nl: "Gekopieerd" })
                : t({ en: "Copy to clipboard", nl: "Kopieer naar klembord" })}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          {t({ en: "Back", nl: "Terug" })}
        </button>
        {step < 2 && (
          <button
            type="button"
            onClick={() => canNext && setStep((s) => s + 1)}
            disabled={!canNext}
            className="inline-flex items-center gap-2 rounded-full bg-gronn-green px-6 py-2.5 text-sm font-medium text-gronn-white transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-40"
          >
            {t({ en: "Next", nl: "Volgende" })}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
