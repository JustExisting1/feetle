import type { Route } from "./+types/home";
import HomePage from "~/pages/Home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feetle 🦶" },
    { name: "description", content: "Welcome to Feetle Rewritten!" },
  ];
}

export default function Home() {
  return <HomePage />;
}
