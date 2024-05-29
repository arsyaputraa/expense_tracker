import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about/")({
  component: About,
});

function About() {
  return <div className="p-2">Show all expenses</div>;
}
