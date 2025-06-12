import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  // For GitHub Pages deployment, we need SPA mode
  ssr: false,

  // GitHub Pages specific configuration
  prerender: ["/"],
} satisfies Config;
