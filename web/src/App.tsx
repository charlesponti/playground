import {
  ArrowRight,
  Code2,
  Grid2x2,
  Layers3,
  Palette,
  Sparkles,
  SquareTerminal,
} from 'lucide-react'

const shortcuts = [
  { label: 'Tailwind', value: 'Utility-first styling' },
  { label: 'Icons', value: 'lucide-react' },
  { label: 'Fonts', value: 'Inter Variable' },
  { label: 'Language', value: 'TypeScript' },
] as const

const notes = [
  'Drop in components and test visual ideas quickly.',
  'Use the cards below as a starting point for layouts, states, and spacing.',
  'The playground ships with Tailwind, TypeScript, and a clean font stack.',
] as const

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300">
              Web Playground
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Vite + Tailwind + TypeScript
            </h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300 md:flex">
            <Sparkles className="h-4 w-4" />
            Ready to prototype
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sky-300">
              <SquareTerminal className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-[0.24em]">
                Playground Canvas
              </span>
            </div>

            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              A polished starter for experimenting with UI ideas.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Use this directory as a small, fast web sandbox for layouts,
              interactions, and visual explorations. It already includes a font
              package, an icon set, and Tailwind configured for quick iteration.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                Open Playground
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                View Notes
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {shortcuts.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-slate-100">{item.value}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-violet-300">
                <Layers3 className="h-5 w-5" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em]">
                  Included
                </h3>
              </div>

              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                {notes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center gap-3 text-amber-300">
                <Palette className="h-5 w-5" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em]">
                  Preview Stack
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/20 to-violet-500/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Grid2x2 className="h-4 w-4" />
                    Cards, grids, and layout experiments
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    Quickly assemble components and see the result immediately.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Code2 className="h-4 w-4" />
                    Type-safe by default
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    Add your own components, data models, or mock APIs without
                    leaving the playground.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default App
