import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/playground", "routes/playground.tsx"),
  route("/border-linear-gradient", "routes/border-linear-gradient.tsx"),
] satisfies RouteConfig;
