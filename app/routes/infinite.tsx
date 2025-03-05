import InfinitePage from "~/pages/Infinite/infinite";
import type { Route } from "./+types/home";
import HomePage from "~/pages/Home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feetle 🦶" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <InfinitePage />;
}
