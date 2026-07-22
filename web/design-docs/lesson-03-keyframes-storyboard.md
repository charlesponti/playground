# Lesson 03: CSS @keyframes as a Storyboard

## The Core Idea

A CSS `transition` is an **A-to-B movement** — one launch command and one brake command. But real physical motion has multiple chapters: yank, pause, struggle, release, snap.

To choreograph multi-phase motion, we use `@keyframes`, which lets us write a **percentage-based storyboard** of exactly where an element should be at any moment in time.

## The Key Insight

A cubic-bezier is one curve for the entire animation. A @keyframes block lets you use **a different speed curve at every step**.

Think of it this way:
- **transition** = a single camera shot
- **@keyframes** = a film edit with multiple shots, each with its own pacing

## The Storyboard Format

```css
@keyframes curtainSnagLeft {
  /* Percentage = position in the timeline (0% = start, 100% = end) */
  /* Property values = what the element looks like at that moment */

  0%   { transform: translateX(0); }
  30%  { transform: translateX(-40%); }
  50%  { transform: translateX(-35%); }
  53%  { transform: translateX(-42%); }
  56%  { transform: translateX(-37%); }
  60%  { transform: translateX(-45%); }
  64%  { transform: translateX(-38%); }
  70%  { transform: translateX(-48%); }
  100% { transform: translateX(-100%); }
}
```

The browser automatically **interpolates** between each keyframe — it figures out the in-between positions so you don't have to.

## Why This Creates Physical Realism

The distance between keyframes determines **velocity**:

- **Large gap, few percentages apart** = very fast movement (the curtain snaps open)
- **Small gap, many percentages apart** = very slow movement (the curtain creeps)
- **Identical value, adjacent percentages** = the object freezes in place

Look at what happens between 53% and 64%:

```
53%  → -42%  (yank hard)
56%  → -37%  (snap back)
60%  → -45%  (tug harder)
64%  → -38%  (snap back)
```

Each of these transitions happens in just 3-4% of the total duration. If the animation is 1.5 seconds long, 3% = 0.045 seconds. That's 45 milliseconds per jiggle — a violent, fabric-shaking vibration.

## Adding Material Physics (Scale)

A curtain doesn't just slide — it **bunches up** against the wall as it's pulled. We simulate this with `scaleX`:

```
0%   → scaleX(1)     (full width, flat)
30%  → scaleX(0.85)  (bunched from the yank)
50%  → scaleX(0.95)  (loosens when slack is let out)
53%  → scaleX(0.80)  (compresses on tug)
60%  → scaleX(0.75)  (compresses harder)
100% → scaleX(0.20)  (fully bunched against wall)
```

By animating `scaleX` and `translateX` simultaneously on the same timeline, the browser blends them into a single physical gesture.

## Combining Multiple Properties

A single keyframe can animate multiple properties at once:

```css
@keyframes curtainSnagLeft {
  0%   {
    transform: translateX(0) scaleX(1);
    filter: var(--filter-flat);
  }
  30%  {
    transform: translateX(-40%) scaleX(0.85);
    filter: var(--filter-warped);
  }
  /* ... */
}
```

The browser interpolates every property independently, then composites them into a single frame.

## The Snag-and-Jiggle Timeline

Let's read the full storyboard for our left curtain as a narrative:

| Time % | What happens | Visual |
|--------|-------------|--------|
| 0–30% | Stagehand pulls rope | Curtain slides open smoothly |
| 30% | Curtain hits snag on track | Abrupt stop, fabric bunches |
| 30–50% | Stagehand lets out slack | Curtain drifts back slightly |
| 50–70% | Stagehand tugs rapidly to free it | Violent back-and-forth jiggle |
| 70–75% | Stagehand braces for final pull | Curtain strains, stretches |
| 75–100% | Snag clears, curtain flies open | Snaps fully off-screen |

Each of these "beats" would require a separate JavaScript state variable in a React approach. In CSS, they're just a list of percentages.

## The Right Curtain

The right curtain does the same dance but in the opposite direction. Instead of negative `translateX` values (moving left), it uses positive values (moving right):

```css
@keyframes curtainSnagRight {
  0%   { transform: translateX(0) scaleX(1); }
  30%  { transform: translateX(40%) scaleX(0.85); }
  50%  { transform: translateX(35%) scaleX(0.95); }
  /* etc. */
}
```

## Key Vocabulary

- **@keyframes:** A CSS at-rule that defines a multi-step animation as a list of percentage-keyed property values.
- **Interpolation:** The automatic calculation of intermediate values between two keyframes. The browser does this for you.
- **Animation-timing-function:** A property you can set *inside* a keyframe to give that segment its own cubic-bezier curve.
- **Storyboard:** The film industry term for a sequence of drawings showing the key moments of a scene. In CSS, our @keyframes percentages serve the same purpose.

## Mental Model

A @keyframes block is a **storyboard**. Each percentage is a frame in the storyboard. The browser fills in the frames between your storyboard panels automatically.

You are not writing every frame of the animation. You are writing the **turning points** — the moments where the direction or velocity changes. The browser handles the in-betweens.

This is the same technique used in professional animation software (After Effects, Blender) where animators set "keyframes" at critical poses and let the software interpolate the rest.
