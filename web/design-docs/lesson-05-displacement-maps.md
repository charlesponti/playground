# Lesson 05: SVG Displacement Maps & The Rubber Sheet Model

## The Core Idea

A displacement map is a **pixel coordinate scrambler**. It doesn't create new pixels or move layers around — it changes the answer to the question "where should I look to find my color?" The result is an organic, fluid warp that makes flat elements look like physical materials.

## Why We Need This

A plain CSS `div` with a background color, even with translateX and scaleX animations, still looks like a **flat rectangle**. The edge is perfectly straight. Real fabric has wavy, organic edges because it's made of woven threads responding to gravity and tension.

A displacement map bends that straight edge into organic curves.

## The Funhouse Mirror Analogy

Imagine your screen content is a giant mosaic of tiny colored tiles. Normally, the tile at position (10, 10) looks directly at the pixel at (10, 10) and displays its color. Everything looks sharp and correct.

A displacement map is like a mischievous manager standing in front of the mosaic, intercepting each tile and saying:

- "Tile (10, 10): don't look at (10, 10). Look 5 pixels to the right instead."
- "Tile (11, 10): don't look at (11, 10). Look 2 pixels left instead."
- "Tile (12, 10): don't look at (12, 10). Look 8 pixels up instead."

Each tile fetches its color from a **different location** than its own. The result is a warped, distorted version of the original image — exactly like looking through a piece of wavy glass.

## Why This Looks Like Fabric (or Liquid)

When thousands of adjacent tiles are told to look at slightly different coordinates, the brain perceives **continuous organic curves**:

- Tiles told to look outward = image stretches (like fabric under tension)
- Tiles told to look inward = image compresses (like fabric bunching)
- Values oscillating in a wave pattern = the edge ripples (like fabric fluttering)

The brain interprets these coordinate shifts as **material deformation**, not a rendering glitch.

## The Two-Part SVG Recipe

An SVG displacement filter needs two elements:

### 1. The Bump Generator: `<feTurbulence>`

This creates a chaotic noise texture — think of it as an invisible map of **hills and valleys** underneath a rubber sheet.

```svg
<feTurbulence
  type="fractalNoise"
  baseFrequency="0.01 0.05"
  numOctaves="2"
  result="noise"
/>
```

**`baseFrequency`** controls the scale of the waves:
- A single value (e.g., `0.02`) creates equally-sized waves in all directions
- Two values (e.g., `0.01 0.05`) creates **stretched** waves — the first number is horizontal frequency, the second is vertical. For curtains, we want vertically stretched folds (higher vertical frequency = longer, taller wrinkles)

**`numOctaves`** controls detail/complexity:
- 1 = perfectly smooth, silky waves
- 2 = soft wrinkles on top of the main waves
- 4+ = rough, burlap-like texture

**`type`** selects the math:
- `fractalNoise` = smoother, more natural
- `turbulence` = sharper, more dramatic creases (better for fabric folds)

### 2. The Scrambler: `<feDisplacementMap>`

This uses the noise texture to actually shift pixels.

```svg
<feDisplacementMap
  in="noise"
  in2="SourceGraphic"
  scale="0"
  xChannelSelector="R"
  yChannelSelector="G"
/>
```

The **secret sauce** is how it uses color channels as movement instructions:

- **Red channel (R):** Controls horizontal shift. Pure red (255) = push far right. Black (0) = push far left. Neutral gray (128) = no shift.
- **Green channel (G):** Controls vertical shift. Pure green (255) = push far down. Black (0) = push far up. Neutral gray = no shift.

The turbulence generator produces a grainy texture with random red and green values. The displacement map reads those values and shifts each pixel accordingly, creating organic, non-uniform distortion.

## The Animated "Scale" Knob

The most important parameter for our use case is `scale`:

- **scale="0"**: No displacement. The curtain edge is perfectly straight.
- **scale="20"**: Pixels shift by up to 20 pixels. The edge gets wavy.
- **scale="50"**: Pixels shift by up to 50 pixels. Major organic distortion.

During the curtain snag, we animate this `scale` value from 0 to 40+ and back. The edge of the curtain suddenly warps into heavy, wavy velvet folds, then snaps back to crisp when the curtain clears.

## Apple's Liquid Glass

Apple's Dynamic Island and other liquid-glass effects use exactly this technique. The difference is **sophistication of the noise map** and **precision of the scale animation**:

- Apple uses custom noise generation (not just stock feTurbulence) for a specific gloss pattern
- They animate the scale with extreme precision — matched to the pixel dimensions of the UI element
- They combine it with `feColorMatrix` and `feGaussianBlur` for a glossy, metallic sheen

But the **core mechanism is identical**: coordinate scrambling via a displacement map.

## The Full SVG Filter

```svg
<filter id="curtain-fabric">
  <!-- 1. Generate the noise texture -->
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.01 0.05"
    numOctaves="2"
    result="noise"
  />

  <!-- 2. Warp the curtain pixels using the noise -->
  <feDisplacementMap
    in="noise"
    in2="SourceGraphic"
    scale="0"
    xChannelSelector="R"
    yChannelSelector="G"
    result="warped"
  />

  <!-- 3. Add lighting simulation (see Lesson 06) -->
  <feSpecularLighting
    in="noise"
    surfaceScale="5"
    specularConstant="0.8"
    specularExponent="20"
    lighting-color="#ffffff"
    result="highlights"
  >
    <fePointLight x="300" y="100" z="200" />
  </feSpecularLighting>

  <!-- 4. Composite the lighting over the warped curtain -->
  <feComposite
    in="highlights"
    in2="warped"
    operator="in"
    result="lit"
  />
  <feComposite
    in="lit"
    in2="warped"
    operator="arithmetic"
    k1="0" k2="1" k3="1" k4="0"
  />
</filter>
```

## Key Vocabulary

- **Displacement map:** A technique where pixel coordinates are modified based on a separate texture (the map), creating distortion.
- **feTurbulence:** An SVG filter primitive that generates Perlin noise — a continuous, organic random texture.
- **feDisplacementMap:** The SVG filter primitive that actually shifts pixels according to a map.
- **Channel selector:** The attribute that picks which color channel (R, G, B, A) controls which axis of movement.
- **Scale (in displacement context):** The intensity of the pixel shift. Higher = more distortion.
- **Perlin noise:** An algorithmic texture invented by Ken Perlin for the movie *Tron* (1982). It generates smooth, natural-looking randomness — the foundation of procedural texture generation.

## Mental Model

Forget the math. Forget the color channels. Picture this:

1. Lay a **clear rubber sheet** over your curtain. Everything looks normal through it.
2. Place a bunch of **marbles** under the rubber sheet, scattered randomly.
3. **Press down** on the rubber sheet. The marbles push up, stretching and warping the rubber.
4. Where the rubber stretches, your curtain edge bends and distorts.
5. **Press harder** = more distortion (the scale value).
6. **Release pressure** = the sheet snaps back to flat.

The `feTurbulence` generates the marbles (the bumpy landscape underneath). The `feDisplacementMap` controls how hard you press the rubber sheet down onto those marbles. The `scale` attribute is your hand pressure.

That's it. That's the entire technique.
