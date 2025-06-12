import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/border-linear-gradient", "routes/border-linear-gradient.tsx"),
  route("/svg-glass-test", "routes/svg-glass-test.tsx"),
] satisfies RouteConfig;
