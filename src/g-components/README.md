# Vendored: @gronnstudio/g-components

Synced copy of https://github.com/gronnstudio/G-components (`main` @ `d6dc779`).

Do NOT edit these files here — change them upstream in the G-components
repo and re-sync (`cp -r <G-components>/src/. src/g-components/`, then
update the sha above). Vendored as source because the repos are private
and no package registry is set up; the app's local modules re-export
from here (see `src/lib/use-reduced-motion.ts` etc.), so call sites
never import this path directly outside those shims.
