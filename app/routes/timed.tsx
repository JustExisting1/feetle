import TimedPage from "~/pages/Timed/timed";
import type { Route } from "./+types/home";
import HealthPage from "~/pages/Health/health";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feetle 🦶" },
    { name: "description", content: "Feetle, how many can you guess in a limited time?" },
  ];
}

export default function Home() {
  return <TimedPage />;
}
