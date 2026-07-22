# Lesson 02: Understanding Cubic Bézier Curves

## The Core Idea

A cubic-bezier is a **speed graph** that tells the browser *how* to accelerate and decelerate over the duration of an animation. It's the single most important skill in making motion feel physical instead of robotic.

## Why Not "Linear"?

A linear animation (`transition: transform 1s linear`) moves at a constant speed from start to finish. Nothing in the physical world moves like this. Curtains accelerate as they're pulled, a bouncing ball decelerates at its peak, a drawer clicks into place with a snap.

Linear animations feel cheap because they lack **weight**. Weight is communicated by changes in velocity.

## The Car Analogy

Imagine you are directing a driver to move a car from the left side of the screen to the right side. The trip must take exactly 1.5 seconds. You give the driver two commands:

### Command 1: The Launch (X1, Y1)

The first two numbers of `cubic-bezier(X1, Y1, X2, Y2)` tell the driver how to start.

- **X1 (Timing):** How quickly after "go" does the driver stomp the gas?
  - 0 = instantly
  - 0.5 = waits until halfway through the trip
  - 1 = waits until the very end

- **Y1 (Power):** How hard do they stomp?
  - 0 = gentle crawl
  - 1 = floor it
  - 2 = tires squealing, burning rubber

### Command 2: The Braking (X2, Y2)

The last two numbers tell the driver how to stop.

- **X2 (Timing):** When does the driver start braking?
  - 0 = brakes immediately (early in the trip)
  - 0.5 = brakes halfway through
  - 1 = brakes at the very last inch

- **Y2 (Braking Style):** How smoothly do they stop?
  - 0 = sudden, neck-snapping jerk to a halt
  - 1 = silky-smooth chauffeur glide

## Analyzing Our Curtain Numbers

```css
transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
```

| Pair | Value | Meaning |
|------|-------|---------|
| (0.25, 1) Launch | Start almost immediately (0.25), floor the gas (1) | The curtain rips open fast right away |
| (0.5, 1) Braking | Start braking at halfway (0.5), coast to silky stop (1) | The curtain spends the second half gliding gently to a stop |

The result: the curtain flies open aggressively in the first 0.75 seconds, then gracefully drifts to a halt over the next 0.75 seconds.

## The Curve Graph

```
Progress ▲
(100%)   ┤
         │        ╱╴╴╴╴╴╴╴╴╴╴  ← Gentle plateau (braking)
         │       ╱
         │      ╱
         │     ╱
         │    ╱  ← Steep slope (launch)
         │   ╱
         │  ╱
         │ ╱
         │╱
(0%)     └──────────────────────────────► Time
                        (1.5s)
```

The steeper the line, the faster the movement. The flatter the line, the slower.

## Common Presets

CSS gives us named keywords that map to specific cubic-beziers:

| Keyword | Equivalent | Feeling |
|---------|------------|---------|
| `linear` | `(0, 0, 1, 1)` | Robotic, constant speed |
| `ease` | `(0.25, 0.1, 0.25, 1)` | Gentle start, gentle stop |
| `ease-in` | `(0.42, 0, 1, 1)` | Slow start, fast finish |
| `ease-out` | `(0, 0, 0.58, 1)` | Fast start, slow finish |
| `ease-in-out` | `(0.42, 0, 0.58, 1)` | Slow start, fast middle, slow stop |

## How to Read Any Cubic-Bezier

When you see a four-number string, ask two questions:

1. **Launch pair (first two):** Does the Y-value approach or exceed 1? That means aggressive acceleration. Does X lean toward 0? The acceleration comes early.

2. **Braking pair (last two):** Does Y approach 0? That means a hard stop (bounce/rubber-band potential). Does Y approach 1? That means a soft glide. Does X lean toward 0.5 or later? The braking starts late.

## The "Bounce" Secret

You can make things bounce by using Y values **below 0** (overshoot backward) or **above 1** (overshoot forward):

```css
/* Snaps past the target and bounces back */
cubic-bezier(0.5, 1.5, 0.5, -0.5)
```

The object flies 50% past its destination (Y1 = 1.5), then snaps back below it (Y2 = -0.5), settling after a few oscillations. This is how you make a cassette "thud" into place.

## Key Vocabulary

- **Easing:** The rate of change of an animation over time. Cubic-bezier is one type of easing function.
- **Linear:** Constant velocity throughout the animation.
- **Overshoot:** When an animated value briefly exceeds its final target before returning (caused by Y > 1).
- **Bounce:** When an animation oscillates around its final value before settling.
- **GPU compositing:** When the browser hands off the `transform` animation to the graphics card. This is why we animate `transform` instead of `left` or `width` — the latter trigger CPU layout recalculation on every frame.

## Your Mental Model

Cubic-bezier is not a magic incantation. It's two instructions:

1. **How to start moving** (gas pedal)
2. **How to stop moving** (brake pedal)

Everything between those two instructions is interpolated automatically by the browser. You are not controlling every frame — you are setting the **velocity envelope** and letting the rendering engine fill in the rest.
