# Wes Anderson Show Setlist

> A static single-page website that stages the Hollywood Bowl setlist as a theatrical performance.
>
> Genre: Design Engineering · Animation Choreography · Theatrical UX

---

## Concept Overview

The site presents the July 12, 2025 Wes Anderson Hollywood Bowl setlist as a theatrical experience. Instead of a static list, the page enacts a four-phase performance: a cold-open film montage, a curtain reveal, a spinning cassette entrance, and the final tracklist. The entire sequence is orchestrated with vanilla JavaScript, CSS animations, and SVG filters — zero framework dependencies.

The theatrical metaphor is literal: the browser window is a stage, the user is an audience member watching a miniature play. Every animation serves the fiction that you are inside a Wes Anderson film's title sequence.

---

## The Four-Phase Timeline

### Phase 1: The Cold Open (0–10 seconds)

The page loads into a full-screen montage of quick, symmetrical cuts from Wes Anderson films. Vibrant pastels, perfectly centered framing. Ambient projector crackle (optional audio). The screen is completely covered — no UI, no chrome, no visible controls.

**State:** `phase: 'montage'`

**Technical requirements:**
- Full-viewport video or image sequence
- No interaction possible; purely cinematic
- Ends with a fade-to-black transition at ~9.5s

### Phase 2: The Curtain Opens (10–11.5 seconds)

At the 10-second mark, the montage fades down. Heavy velvet stage curtains appear and split down the center, sliding off-screen left and right. The curtains are not flat rectangles — they ripple with organic fabric motion.

**State:** `phase: 'curtain-open'`

**Timing:**
- 0% (10.0s): Curtains fully closed, covering screen
- 30% (10.45s): Initial yank — curtains fly 40% open
- 30–50%: Snag! Curtain stops, eases back
- 50–70%: Rapid jiggle as stagehand tugs the rope
- 70–75%: Final strain before break
- 75–100% (11.5s): Snag clears, curtains snap off-screen

**Technical requirements:**
- Curtains are two `div` elements (left/right), each 50vw wide, 100vh tall
- No `position: fixed` layout animations — use `transform: translateX()` and `scaleX()`
- Curtain material is simulated with `feTurbulence` + `feDisplacementMap` + `feSpecularLighting`
- Animation driven by CSS `@keyframes` with percentage storyboard
- Class `.open` toggled via vanilla JS `setTimeout` at 10s

### Phase 3: The Cassette Enters (11.5–13 seconds)

As the curtains clear, a retro cassette tape emerges from the bottom of the screen. It spins upward as if being wound, then settles dead-center with a subtle "thud" ease.

**State:** `phase: 'cassette-enter'`

**Technical requirements:**
- Cassette is an SVG or CSS-drawn element
- Animated with `transform: translateY()` combined with `rotate()`
- Eases into center with a gentle bounce (custom cubic-bezier)
- Acts as the hero visual; doubles as the "album art"

### Phase 4: The Final Reveal (13+ seconds)

The tracklist and purchase button fade in around the cassette. The layout is perfectly centered, symmetrical, typographically clean. The cassette stays as the centerpiece.

**State:** `phase: 'tracklist-reveal'`

**Technical requirements:**
- Tracklist fades in with staggered timing per item (or a single container fade)
- Typography: bold, tightly-spaced serif or sans-serif, fully capitalized
- "Buy Cassette" button styled as vintage ticket or label
- No additional animations after reveal — the page is now static and browsable

---

## Aesthetic Palette

### Colors

| Role | Color | Description |
|------|-------|-------------|
| Background | Pale desaturated canary yellow or dusty chalky pink | Warm, muted, film-grain soft |
| Curtains | Deep burnt saffron or dark crimson velvet | Heavy, rich theatrical contrast |
| Cassette shell | Mint green or cream | Retro mixtape feel |
| Typography | Near-black or deep brown | Warm ink, not pure #000 |

### Typography

- Futura Bold or similar geometric sans-serif
- Tight letter-spacing
- All caps for headings and track titles
- Centered alignment throughout
- Feels like a film title card

### Motion language

- Every movement has a reason (theatrical mechanics)
- Easing curves mimic physical objects: heavy fabric, spinning plastic, rope tension
- No movement after Phase 4 — the page settles into stillness like a final frame

---

## Architecture Decisions

### Why no React

The page has zero interactivity requirements. It plays a timed sequence of CSS class toggles and then becomes static. Adding React (or any framework) would add ~40–80KB of JavaScript to perform what a single `setTimeout` and `classList.add` call accomplishes.

**Dependency budget:**
- 1 `index.html` file
- 1 `styles.css` file
- 1 inline `<script>` block
- 1 SVG filter definition (inline in HTML)

Zero external dependencies. Zero runtime libraries. Zero build step for animation logic.

### Rendering pipeline

```
JS Timer ──> classList.toggle('.open') ──> CSS @keyframes ──> GPU (transform/opacity)
                                              │
                                              └──> SVG <filter> ──> feTurbulence + feDisplacementMap + feSpecularLighting
```

JavaScript does exactly one thing: flips a switch at the right time. CSS handles all visual execution. SVG filters handle material simulation. This is the design engineering principle of **separation of concerns at the rendering level.**

---

## SVG Filter Architecture

### feTurbulence (The Folds Generator)

Generates Perlin noise to create organic, non-uniform wave patterns.

**Parameters:**
- `baseFrequency="0.01 0.05"` — horizontal/vertical wave scale (vertical folds stretch longer)
- `numOctaves="2"` — smooth but with micro-wrinkles
- `type="fractalNoise"` — organic creases

### feDisplacementMap (The Coordinate Scrambler)

Uses the turbulence noise to physically warp the curtain's pixels.

**Parameters:**
- `in="noise"` — input from turbulence
- `scale` — animated from 0 (flat) to 40+ (warped) during snag
- `xChannelSelector="R"` — red channel controls horizontal shift
- `yChannelSelector="G"` — green channel controls vertical shift

### feSpecularLighting (The Lighting Engine)

Calculates highlights and shadows based on wave slopes.

**Parameters:**
- `surfaceScale="5"` — depth of folds
- `specularConstant="0.8"` — soft velvet sheen
- `specularExponent="20"` — spread of light

**Light source (fePointLight):**
- `x="300"` — slightly right of center
- `y="100"` — high, like a theater spotlight
- `z="200"` — moderate distance from stage

---

## CSS Animation Architecture

### @keyframes: curtainSnagLeft

```css
@keyframes curtainSnagLeft {
  0%   { transform: translateX(0) scaleX(1); }
  30%  { transform: translateX(-40%) scaleX(0.85); }  /* Yank + bunch */
  50%  { transform: translateX(-35%) scaleX(0.95); }  /* Slack release */
  53%  { transform: translateX(-42%) scaleX(0.80); }  /* Tug 1 */
  56%  { transform: translateX(-37%) scaleX(0.90); }  /* Bounce back */
  60%  { transform: translateX(-45%) scaleX(0.75); }  /* Tug 2 */
  64%  { transform: translateX(-38%) scaleX(0.88); }  /* Bounce back */
  70%  { transform: translateX(-48%) scaleX(0.70); }  /* Hard strain */
  100% { transform: translateX(-100%) scaleX(0.20); } /* Clear + bunched */
}
```

Right curtain mirrors with positive translateX values.

### Transition filter animation

The `scale` property of `feDisplacementMap` is animated alongside transforms. During the snag (30–70%), the displacement scale jumps from 0 to 40+, warping the curtain edge. During the final snap (70–100%), it returns to 0, making the edge crisp again.

---

## Files to Build

1. **index.html** — Single HTML file containing structure, SVG filter definitions, and inline script
2. **styles.css** — All animations, transitions, layout, typography
3. **montage-assets/** — Video clips or image sequence for the cold open

(Or, for absolute simplicity: one single `index.html` with everything inlined, plus a `styles.css`.)

---

## Setlist Data

### Act I

| # | Song | Artist/Context |
|---|------|----------------|
| 1 | Attack on Ping Island | Mark Mothersbaugh (The Life Aquatic) |
| 2 | Ned's Theme Take 1 | Mark Mothersbaugh (The Life Aquatic) |
| 3 | Gut Feeling (Slap Your Mammy) | DEVO |
| 4 | Alone Again Or (Love cover) | Beck (Bottle Rocket) |
| 5 | Freight Train | Jenny Lewis |
| 6 | Les Temps De L'Amour (Françoise Hardy cover) | Karen Elson (Moonrise Kingdom) |
| 7 | Adagio (Georges Delerue cover) | |
| 8 | String Quartet in F Major (Maurice Ravel cover) | (The Royal Tenenbaums) |
| 9 | A Prayer for Madame D (Alexandre Desplat) | Ukrainian Mosaic Orchestra (The Grand Budapest Hotel) |
| 10 | Canto at Gabelmeister's Peak (Alexandre Desplat) | Ukrainian Mosaic Orchestra (The Grand Budapest Hotel) |
| 11 | Shinto Shrine (Alexandre Desplat) | Kaoru Watanabe (Isle of Dogs) |
| 12 | Strangers (The Kinks cover) | Jim James (The Darjeeling Limited) |
| 13 | This Old Machine | Jason Schwartzman & China Forbes |
| 14 | Any Fun | Jason Schwartzman |
| 15 | Zorro is Back (Oliver Onions cover) | Rogê, Beck, China Forbes, Jenny Lewis, & Bill Murray |

### Act II

| # | Song | Artist/Context |
|---|------|----------------|
| 1 | Moses Rosenthaler | Jean-Yves Thibaudet (The French Dispatch) |
| 2 | Blinuet | Jeff Goldblum (The Grand Budapest Hotel) |
| 3 | The Fairest of Seasons (Nico cover) | Jackson Browne (The Royal Tenenbaums) |
| 4 | These Days (Nico cover) | Jackson Browne (The Royal Tenenbaums) |
| 5 | Mr. Fox in the Fields (Alexandre Desplat) | (Fantastic Mr. Fox) |
| 6 | Sparkplug Minuet | Mark Mothersbaugh & LA Children's Choir (The Royal Tenenbaums) |
| 7 | The Wind (Cat Stevens cover) | Jim James (Rushmore) |
| 8 | Rue Saint-Vincent (Yves Montand cover) | China Forbes & Rufus Wainwright (The French Dispatch) |
| 9 | Where Do You Go To (My Lovely) (Peter Sarstedt cover) | Rufus Wainwright (The Darjeeling Limited) |
| 10 | Needle in the Hay (Elliott Smith cover) | Beck (The Royal Tenenbaums) |
| 11 | Let Her Dance (Bobby Fuller Four cover) | Beck, Jim James, Jenny Lewis, Bill Murray, & Jason Schwartzman (Fantastic Mr. Fox) |
| 12 | Making Time (The Creation cover) | Britt Daniel (Rushmore) |
| 13 | Ooh La La (Faces cover) | Entire Ensemble (Rushmore) |

---

## State Machine

```
   [load]
     │
     ▼
  ┌─────────────┐     setTimeout(10000)     ┌────────────────┐
  │ PHASE 1:    │ ───────────────────────►  │ PHASE 2:       │
  │ Montage     │                           │ Curtain Open   │
  │ (0–10s)     │                           │ (10–11.5s)     │
  └─────────────┘                           └───────┬────────┘
                                                     │
                                             @keyframes completes
                                                     │
                                                     ▼
  ┌─────────────┐     setTimeout + ease     ┌────────────────┐
  │ PHASE 4:    │ ◄───────────────────────  │ PHASE 3:       │
  │ Tracklist   │    reveal content          │ Cassette Spin  │
  │ (13s+)      │                           │ (11.5–13s)     │
  └─────────────┘                           └────────────────┘
```

JavaScript manages the phase transitions. Each phase is triggered by `setTimeout`, which toggles a class on the `body` or a container element. CSS `@keyframes` and `transition` properties handle the actual visual execution within each phase. The two concerns never mix.
