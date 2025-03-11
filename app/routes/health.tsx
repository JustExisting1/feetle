import type { Route } from "./+types/home";
import HealthPage from "~/pages/Health/health";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feetle 🦶" },
    { name: "description", content: "Feetle where every guess matters." },
  ];
}

export default function Home() {
  return <HealthPage />;
}
