# Lesson 01: The Four-Phase Timeline & Why No Framework

## The Core Idea

A design-engineered page is a **timeline**, not a layout. Every element arrives, moves, and settles on a schedule. We are directing a theatrical performance, not building a dashboard.

## The Phase Model

Every complex animation sequence can be decomposed into distinct **phases**. Each phase has:

- **A trigger:** What causes the phase to start (timer, user action, previous phase completion)
- **A duration:** How long the phase lasts
- **A state variable:** The single piece of information that says "we are now in this phase"
- **An exit condition:** What must happen before the next phase begins

For the Wes Anderson site, the phases are:

| Phase | Trigger | Duration | State |
|-------|---------|----------|-------|
| 1. Montage | Page load | 10 seconds | `body[data-phase="montage"]` |
| 2. Curtain Open | setTimeout(10000) | 1.5 seconds | `body[data-phase="curtain"]` |
| 3. Cassette Spin | Animation end | 1.5 seconds | `body[data-phase="cassette"]` |
| 4. Tracklist Reveal | Animation end | — (static) | `body[data-phase="reveal"]` |

## Why Vanilla JavaScript (No React)

### The trap

Most developers reach for React the moment they think of "state." But React is for **interactivity** — responding to user input, re-rendering components, managing complex dependency trees.

### The reality of this page

This page has exactly **zero** interactive state changes. No buttons to click. No forms to fill. No data to fetch. The entire "state machine" is:

```javascript
setTimeout(() => {
  document.body.classList.add('phase-curtain');
}, 10000);

setTimeout(() => {
  document.body.classList.add('phase-cassette');
}, 11500);

setTimeout(() => {
  document.body.classList.add('phase-reveal');
}, 13000);
```

That's it. Three `setTimeout` calls. Three `classList.add` calls. Every visual consequence flows from CSS.

### The cost of React

- **~40KB gzipped** for the React runtime
- **Bundle splitting overhead** — even code-split, the critical path includes the framework
- **Parse/execute time** — the browser must download, parse, and execute the framework before doing anything else
- **Mental overhead** — component trees, hooks, memoization, re-render guards for a page that renders once

### The vanilla advantage

- **~0 bytes** of framework JavaScript
- **Timeline logic is linear and obvious** — three setTimeout calls, read top to bottom
- **CSS handles all visual work** — the GPU does the heavy lifting, not the JS thread
- **Page is instantly interactive** — the cold open montage plays immediately, no framework boot-up needed

## The Golden Rule of Design Engineering

> JavaScript should only **flip switches**. CSS should do the **heavy lifting**.

A switch flip is one line: `el.classList.add('open')`. If your JavaScript is doing more than that to drive animation, you are fighting the browser's rendering pipeline.

## Key Vocabulary

- **Hardware acceleration:** When the browser hands off rendering work to the GPU (graphics card). Triggered by animating `transform` and `opacity`. Layout properties like `width`, `left`, `height` force the CPU to recalculate layout on every frame — expensive and janky.
- **classList:** The native DOM API for adding, removing, and toggling CSS classes. It is the bridge between JavaScript timers and CSS animation.
- **setTimeout:** A native JavaScript function that executes a callback after a specified number of milliseconds. The simplest possible timeline engine. In design engineering, it's often all you need.

## Mental Model

Think of your browser as a theater with three crews:

1. **JavaScript (Stage Manager):** Stands in the wings with a stopwatch. At exactly the right moment, they flip a single switch (add a class). Then they step back and do nothing.

2. **CSS (Scenic Designer):** Has built the entire set — the curtains, the cassette, the typography — and knows exactly how each piece should move when the switch is flipped. The scenic designer does all the visible work.

3. **GPU (Stagehands):** Receive instructions from CSS and physically move the set pieces using ropes and pulleys (hardware-accelerated transforms). They are invisible, fast, and silent.

The stage manager never touches a set piece. They just signal the scenic designer, who instructs the stagehands.
