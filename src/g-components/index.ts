// Hooks
export { useReducedMotion, usePrefersReducedMotion } from "./hooks/use-reduced-motion"
export { useHydrated } from "./hooks/use-hydrated"
export { useStandalone, isStandalone } from "./hooks/use-standalone"
export { useFocusTrap } from "./hooks/use-focus-trap"
export { useDeferredVisible } from "./hooks/use-deferred-visible"
export { useInstallPrompt, type InstallPromptMode } from "./hooks/use-install-prompt"

// Lenis smooth scroll + the (now typed) window.__lenis contract
export { SmoothScroll, getLenis, scrollToTop } from "./lenis"

// Motion vocabulary
export { EASE_REVEAL, EASE_CURTAIN, DURATION_CURTAIN } from "./motion/constants"

// Components
export { BackToTop } from "./components/back-to-top"
export { ScrollProgressBar, useScrollProgress } from "./components/scroll-progress-bar"
export { Magnetic } from "./components/magnetic"
export { FadeIn } from "./components/fade-in"
export { RegisterSW } from "./components/register-sw"
