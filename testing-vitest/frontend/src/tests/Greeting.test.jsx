import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Greeting from "../components/Greeting";

test("renders greeting text", () => {
  render(<Greeting />);

  expect(screen.getByText("Hello, Vitest!")).toBeInTheDocument();
});