import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallLabel } from "../ToolCallLabel";

afterEach(() => {
  cleanup();
});

// --- str_replace_editor labels ---

test("shows 'Creating' label for str_replace_editor create command", () => {
  render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "create", path: "/components/Card.jsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Creating /components/Card.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor str_replace command", () => {
  render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/App.jsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor insert command", () => {
  render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/utils.ts" }}
      state="result"
    />
  );

  expect(screen.getByText("Editing /utils.ts")).toBeDefined();
});

test("shows 'Viewing' label for str_replace_editor view command", () => {
  render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "view", path: "/index.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Viewing /index.tsx")).toBeDefined();
});

test("shows 'Undoing edit to' label for str_replace_editor undo_edit command", () => {
  render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "/Header.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Undoing edit to /Header.tsx")).toBeDefined();
});

// --- file_manager labels ---

test("shows 'Renaming' label for file_manager rename command", () => {
  render(
    <ToolCallLabel
      toolName="file_manager"
      args={{ command: "rename", path: "/old-name.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Renaming /old-name.tsx")).toBeDefined();
});

test("shows 'Deleting' label for file_manager delete command", () => {
  render(
    <ToolCallLabel
      toolName="file_manager"
      args={{ command: "delete", path: "/temp.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Deleting /temp.tsx")).toBeDefined();
});

// --- Fallback ---

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolCallLabel
      toolName="some_unknown_tool"
      args={{ foo: "bar" }}
      state="result"
    />
  );

  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

// --- Status indicators ---

test("shows spinner when state is not 'result'", () => {
  const { container } = render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "create", path: "/Loading.tsx" }}
      state="call"
    />
  );

  // The Loader2 icon renders as an SVG with the animate-spin class
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).not.toBeNull();

  // There should be no green dot
  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeNull();
});

test("shows green dot when state is 'result'", () => {
  const { container } = render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "create", path: "/Done.tsx" }}
      state="result"
    />
  );

  // Green dot should be present
  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).not.toBeNull();

  // No spinner should be present
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeNull();
});
