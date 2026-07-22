# Lesson 04: The Curtain Snag & Jiggle Micro-Animation

## The Core Idea

A micro-animation is a tiny, time-limited movement that communicates **material physics** and **character**. The curtain getting stuck and the stagehand's frustrated tugs add personality to what would otherwise be a generic slide-in.

This is the difference between "animation" and **design engineering** — animation makes things move, design engineering makes things *feel*.

## The Narrative Beat

We are telling a tiny, 1.5-second story:

1. A stagehand pulls the curtain rope
2. The curtain jams on a faulty track
3. The stagehand tries to release the tension
4. They tug furiously to free it
5. It breaks free with a snap

There's a character in this story (the invisible stagehand), an obstacle (the snag), and a resolution (the snap). All of this happens in 1.5 seconds. The user won't consciously register it, but they will *feel* that the curtain has weight and the world is alive.

## The Tug-of-War Mechanics

The jiggle works because it alternates between **tension** and **release** at high frequency:

```
Tension:   translateX(-42%)  ← curtain pulled hard left
Release:   translateX(-37%)  ← curtain drifts right (slack)
Tension:   translateX(-45%)  ← pulled harder
Release:   translateX(-38%)  ← drifts again
Strain:    translateX(-48%)  ← final maximal pull before break
```

Each tension-relaxation cycle is a single "tug." Three tugs in rapid succession communicate frustration and physical effort.

## The Framer's Trick

The jiggle feels violent because the keyframes are **packed tightly** together:

```css
53%  { transform: translateX(-42%); }
56%  { transform: translateX(-37%); }   /* 3% later */
60%  { transform: translateX(-45%); }   /* 4% later */
64%  { transform: translateX(-38%); }   /* 4% later */
```

In a 1.5s animation, 3% = **0.045 seconds** = 45ms. That's faster than a human blink (100-150ms). The browser renders these at 60fps (16.7ms per frame), meaning each tug takes about 2-3 frames.

The result: the curtain appears to vibrate and shake, not smoothly translate.

## The Scale Squish (Accordion Effect)

Simultaneously with the translation, we change the curtain's **horizontal scale** to simulate fabric bunching and releasing:

| Moment | scaleX | Visual Effect |
|--------|--------|---------------|
| Rest (0%) | 1.0 | Full flat curtain |
| Yank (30%) | 0.85 | Fabric compresses against wall |
| Slack (50%) | 0.95 | Fabric loosens, relaxes |
| Tug 1 (53%) | 0.80 | Sharp compression |
| Tug 2 (60%) | 0.75 | Harder compression |
| Snap (100%) | 0.20 | Fully bunched, disappeared |

Without scaleX, the curtain looks like a flat panel sliding sideways. With scaleX, it looks like fabric gathering folds.

## The Filter Warp (Displacement Map)

During the snag, we also activate the SVG displacement map to warp the curtain's edge:

- **0–30%:** Displacement scale = 0 (crisp, straight edge)
- **30–70%:** Displacement scale = 40+ (wavy, organic edge — the curtain is "shivering")
- **70–75%:** Scale peaks at 50 (max distortion right before break)
- **75–100%:** Scale returns to 0 (clean snap open)

This warp is invisible to someone who doesn't know it's there. But combined with the translateX and scaleX, it creates the complete illusion of heavy velvet fabric.

## Why Three Simultaneous Properties?

Real fabric doesn't just slide. It:

1. **Moves** (translateX) — the curtain goes left
2. **Bunches** (scaleX) — the fabric compresses
3. **Wrinkles** (displacement map) — the edge distorts

Each CSS/SVG property handles one aspect of the physics. No single property can do all three convincingly. Design engineering is about **layering** simple effects to create complex illusions.

## The Full Keyframe Block

```css
@keyframes curtainSnagLeft {
  0%   {
    transform: translateX(0) scaleX(1);
    --displacement-scale: 0;
  }
  30%  {
    transform: translateX(-40%) scaleX(0.85);
    --displacement-scale: 40;
  }
  50%  {
    transform: translateX(-35%) scaleX(0.95);
    --displacement-scale: 30;
  }
  53%  {
    transform: translateX(-42%) scaleX(0.80);
    --displacement-scale: 45;
  }
  56%  {
    transform: translateX(-37%) scaleX(0.90);
    --displacement-scale: 35;
  }
  60%  {
    transform: translateX(-45%) scaleX(0.75);
    --displacement-scale: 50;
  }
  64%  {
    transform: translateX(-38%) scaleX(0.88);
    --displacement-scale: 40;
  }
  70%  {
    transform: translateX(-48%) scaleX(0.70);
    --displacement-scale: 50;
  }
  100% {
    transform: translateX(-100%) scaleX(0.20);
    --displacement-scale: 0;
  }
}
```

(Note: the `--displacement-scale` is a CSS custom property that we'll connect to the SVG filter's scale attribute — see Lesson 05.)

## Key Vocabulary

- **Micro-animation:** A very short, targeted animation (usually < 2 seconds) that communicates a specific physical or emotional quality.
- **Fabric bunching:** The visual compression of material as it's pushed against a stationary edge.
- **Snag:** A catch or obstruction that interrupts smooth motion. In animation, a snag creates tension before release.
- **Multiple property interpolation:** Animating several CSS properties simultaneously on the same @keyframes timeline, each with its own values.

## Mental Model

Think of the curtain as having three layers of behavior:

1. **Where it is** (translateX) — the "plot" of the scene
2. **How compressed it is** (scaleX) — the "physical state"
3. **How distorted its edge is** (displacement) — the "material quality"

By controlling all three simultaneously, you create a single believable object. Change only one, and it looks like a cardboard cutout sliding on a track.

The snag-and-jiggle is the moment where all three layers interact most intensely — the plot stops (translateX pauses), the compression spikes (scaleX drops), and the material warps (displacement activates). That combination sells the illusion.
