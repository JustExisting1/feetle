import InfinitePage from "~/pages/Infinite/infinite";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feetle 🦶" },
    { name: "description", content: "Feetle, infinite fun in a relaxed gamemode." },
  ];
}

export default function Home() {
  return <InfinitePage />;
}
