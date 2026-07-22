# Wes Anderson Show Setlist — Design Engineering Curriculum

This directory contains a project specification and a series of lessons that emerged from a design engineering walk-through conversation. The goal was to design and build a theatrical single-page website that presents the July 12, 2025 Wes Anderson Hollywood Bowl setlist as a staged performance.

---

## Project Spec

**[wes-anderson-setlist.md](./wes-anderson-setlist.md)** — The complete project description: concept, phases, aesthetic palette, architecture decisions, SVG filter design, CSS animation architecture, setlist data, and state machine.

---

## Lessons

| # | Lesson | Topic | Key Skill |
|---|--------|-------|-----------|
| 01 | [Timeline Phases & No Framework](./lesson-01-timeline-phases.md) | Why vanilla JS over React, the four-phase model, separation of concerns | Architecture decision-making |
| 02 | [Cubic Bézier Curves](./lesson-02-cubic-bezier.md) | The gas pedal / brake pedal model, speed graphs, bounce curves | Motion design vocabulary |
| 03 | [@keyframes Storyboard](./lesson-03-keyframes-storyboard.md) | Multi-chapter animation, percentage timeline, combining transforms | CSS animation architecture |
| 04 | [Curtain Snag & Jiggle](./lesson-04-curtain-snag-jiggle.md) | Micro-animation storytelling, fabric bunching, simultaneous properties | Material physics in CSS |
| 05 | [Displacement Maps](./lesson-05-displacement-maps.md) | The rubber sheet model, feTurbulence, feDisplacementMap, coordinate scrambling | SVG filter fundamentals |
| 06 | [Perlin Noise & Phong Reflection](./lesson-06-perlin-noise-phong.md) | Organic fold generation, 3D lighting on 2D surfaces, compositing pipeline | Procedural texture & lighting |

---

## Suggested Reading Order

1. **Lesson 01** — Start here to understand the overall architecture and why no framework is needed.
2. **Lesson 02** — Understanding cubic-bezier is foundational to all motion work.
3. **Lesson 03** — Keyframes are the core tool for choreographing multi-step animations.
4. **Lesson 04** — Combines lessons 02 and 03 into a real micro-animation narrative.
5. **Lesson 05** — Introduces SVG filters, which are needed for the fabric effect.
6. **Lesson 06** — Adds lighting for the final material realism.

Then read the **[project spec](./wes-anderson-setlist.md)** with full context.

---

## Design Engineering Principles (Across All Lessons)

1. **JavaScript flips switches; CSS does the work.** — The JS thread should only add/remove classes and set timers. All visual execution belongs in CSS.

2. **Transform before layout.** — Animate `transform` and `opacity` only. These trigger GPU compositing. Animating `width`, `height`, `left`, `top` triggers CPU layout recalculation.

3. **Decompose complex effects into simple layers.** — Fabric = movement (translateX) + compression (scaleX) + warping (displacement) + lighting (specular). No single property can do all four.

4. **Every animation tells a story.** — The curtain snag has a character (stagehand), an obstacle (snag), and a resolution (snap). Motion without narrative is just decoration.

5. **Use the browser's built-in algorithms.** — Perlin noise, Phong reflection, coordinate scrambling — these are built into SVG. Don't write them from scratch. Just configure them.
