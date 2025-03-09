import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/infinite", "routes/infinite.tsx") ,
  route("/health", "routes/health.tsx") 
] satisfies RouteConfig;
