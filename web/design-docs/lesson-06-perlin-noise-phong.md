# Lesson 06: Perlin Noise & Phong Reflection — Fabric + Light

## The Core Idea

A displacement map bends the shape. But **fabric has depth** — light catches on the peaks of folds and falls into shadow in the valleys. Without lighting simulation, your curtain looks like a flat image that's been smeared around. With lighting simulation, it looks like physical velvet.

Two algorithms do all the work:

1. **Perlin Noise** — generates the organic, non-uniform fold pattern
2. **Phong Reflection** — calculates highlights and shadows on those folds

You don't write these algorithms. The browser has them built-in as SVG filter primitives. You just configure parameters.

---

## Part 1: Perlin Noise — The Fold Algorithm

### Why Not Sine Waves?

A sine wave (`sin(x)`) produces perfectly uniform, repeating ripples. A curtain with perfect sine-wave folds would look like a digital render from 1995 — too regular, too fake.

Real fabric folds vary in width, depth, and spacing because of:
- Inconsistent tension at the top rail
- Gravity pulling differently at different heights
- The weight of the fabric stretching some sections more than others

Perlin noise solves this by generating **controlled randomness**.

### What Perlin Noise Is

Invented by Ken Perlin for the movie *Tron* (1982), Perlin noise is a mathematical function that produces a continuous, natural-looking random landscape.

Key properties:
- **Continuous:** Nearby values are similar (no abrupt jumps)
- **Non-repeating:** The pattern never exactly repeats
- **Multi-scale:** You can layer coarse noise with fine noise (octaves)
- **Deterministic:** Same inputs always produce the same output

### How It Generates Folds

The noise creates a **height map** — imagine a topographical map of rolling hills. The "height" at each point determines how much the displacement map shifts the pixel at that point.

```
  Peak (highlight catches here)
   ▲
   │    ╱╲        ╱╲
   │   ╱  ╲      ╱  ╲      ╱╲
   │  ╱    ╲    ╱    ╲    ╱  ╲
   │ ╱      ╲  ╱      ╲  ╱    ╲
   │╱        ╲╱        ╲╱      ╲
   └───────────────────────────────►
  Valley (shadow falls here)
```

The left-right axis is the curtain's width. The up-down axis is the fold depth.

Because Perlin noise is non-uniform:
- Some folds are deep and wide (heavy fabric drape)
- Others are shallow and tight (tension near the rings)
- The pattern organically shifts as you go from top to bottom (baseFrequency creates vertical stretch)

### Configuring Perlin Noise for Velvet

```svg
<feTurbulence
  type="fractalNoise"
  baseFrequency="0.01 0.05"
  numOctaves="2"
  result="curtainWaves"
/>
```

| Parameter | Value | Why |
|-----------|-------|-----|
| type | `fractalNoise` | Smoother, more organic than `turbulence` |
| baseFrequency | `0.01 0.05` | Horizontal waves are wide (0.01), vertical folds stretch long (0.05) — mimics hanging fabric |
| numOctaves | `2` | One layer for big folds, one for subtle micro-wrinkles. Higher = rougher texture |

---

## Part 2: Phong Reflection — The Lighting Algorithm

### Why We Need It

If we only use the displacement map, the curtain edge bends but the surface is uniformly colored. Real fabric shows **specular highlights** (bright spots where light hits the raised parts of a fold) and **ambient shadow** (dark areas in the depths of a fold).

The Phong reflection model calculates this automatically.

### How Phong Works

Named after Bui Tuong Phong (1975), this model simulates three types of light on a 3D surface:

1. **Ambient:** The base level of light everywhere (prevents pure black shadows)
2. **Diffuse:** Light scattered evenly in all directions from a surface point (soft, matte look)
3. **Specular:** Light reflected directly toward the viewer (bright, shiny spots)

For velvet curtains, we want:
- High ambient (even stage lighting)
- Medium diffuse (soft light absorption)
- Low specular (velvet isn't shiny, but it has a subtle sheen)

### How the Browser Does It

The browser takes the noise texture (from feTurbulence) and treats it as a **3D height map**. For each pixel:

1. Calculate the **surface normal** — the direction the fold is facing at that exact point
2. Calculate the **light direction** — where your virtual spotlight is pointing from
3. Compute the **angle** between the normal and the light direction
4. Brighter = more directly facing the light. Darker = facing away.

### Configuring Phong for Velvet

```svg
<feSpecularLighting
  in="curtainWaves"
  surfaceScale="5"
  specularConstant="0.8"
  specularExponent="20"
  lighting-color="#ffffff"
  result="highlights"
>
  <fePointLight x="300" y="100" z="200" />
</feSpecularLighting>
```

| Parameter | Value | Why |
|-----------|-------|------|
| `in` | `curtainWaves` | Tells the lighting engine: "Use this noise as the 3D surface" |
| `surfaceScale` | `5` | How deep the folds are. Higher = more dramatic highlights and shadows |
| `specularConstant` | `0.8` | Intensity of the specular reflection. Velvet is 0.5–0.8 (matte but present) |
| `specularExponent` | `20` | Spread of the highlight. Higher = tighter, more focused glare. Lower = softer, wider glow |
| `lighting-color` | `#ffffff` | Color of the virtual spotlight |

### The Light Source: `<fePointLight>`

Think of this as a bare lightbulb hanging somewhere in 3D space. It takes X, Y, and Z coordinates:

```svg
<fePointLight x="300" y="100" z="200" />
```

- **X:** Horizontal position. 0 = far left, 500+ = far right. 300 puts the light slightly right of center.
- **Y:** Vertical position. 0 = top of stage, 500+ = floor level. 100 = a spotlight hanging from the rafters.
- **Z:** Depth (how far from the screen). 50 = right up against the fabric (intense pinpoint). 500 = far back in the audience (wide, diffuse glow). 200 = a moderate theater distance.

By adjusting these three numbers, you can simulate:
- A spotlight from above (Y low, Z moderate)
- Footlights from below (Y high, Z close)
- A wash from the wings (X extreme, Z far)

---

## Part 3: Compositing — Bringing It Together

The lighting filter produces a grayscale image where bright pixels = highlights and dark pixels = shadows. We need to blend this with the actual curtain color.

The compositing pipeline:

```
Curtain Color ──┬──> feDisplacementMap ──> warped curtain
                │
Noise ──────────┤──> feSpecularLighting ──> highlights/shadows
                │
                └──> feComposite (multiply/add) ──> final lit fabric
```

```svg
<!-- Composite the highlights over the warped curtain -->
<feComposite in="highlights" in2="warped" operator="in" result="lit" />
<feComposite in="lit" in2="warped" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
```

The `arithmetic` operation with `k2="1"` and `k3="1"` adds the lighting layer on top of the curtain color. The result: a crimson curtain with realistic highlights catching the peaks of its folds and deep shadows in the valleys.

---

## Key Vocabulary

- **Perlin noise:** An algorithmic texture function that produces continuous, non-repeating, natural-looking randomness. Foundation of procedural texture generation (fire, clouds, terrain, fabric).
- **Height map:** A grayscale image where brightness represents elevation. Used as input to lighting algorithms.
- **Phong reflection:** A 3D lighting model that calculates ambient, diffuse, and specular light based on surface normals and light direction.
- **feSpecularLighting:** The SVG filter primitive that implements Phong reflection on a height map.
- **fePointLight:** A light source with a specific 3D position (X, Y, Z). Creates realistic, positional highlights.
- **Surface normal:** A vector perpendicular to the surface at a given point. The angle between the normal and the light source determines brightness.
- **Specular highlight:** The bright spot that appears on glossy surfaces where light reflects directly toward the viewer.
- **Compositing (feComposite):** The SVG primitive that blends two images together (e.g., adding lighting on top of a colored layer).

## Mental Model

Imagine a **white theater spotlight** shining on a **deep red velvet curtain**:

1. The curtain has folds — some parts bulge outward (peaks), some sink inward (valleys)
2. The peaks catch the spotlight and look brighter, slightly pinkish from the white light
3. The valleys face away from the light and fall into deep, dark shadow
4. As the curtain moves (yank, jiggle, snap), the peaks and valleys shift, and the light pattern shifts with them

The Perlin noise algorithm generates the **folds**. The Phong reflection algorithm calculates **where the light hits**. The displacement map **moves the pixels**. Three separate algorithms, each doing one thing, composited together to create a single believable object.

This is the essence of design engineering at the rendering level: **decompose a complex visual into simple algorithmic layers, then composite them**.
