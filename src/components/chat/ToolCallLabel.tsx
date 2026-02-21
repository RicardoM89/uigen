import { Loader2 } from "lucide-react";

interface ToolCallLabelProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
}

/**
 * Converts raw tool names and arguments into user-friendly labels.
 *
 * Instead of showing "str_replace_editor" in the chat, users see something
 * like "Creating /components/Card.jsx" — much easier to follow along with
 * what Claude is doing behind the scenes.
 */
function getLabel(toolName: string, args: Record<string, unknown>): string {
  // The `path` arg is used by both tools to indicate which file is affected
  const path = (args.path as string) || "";

  if (toolName === "str_replace_editor") {
    // `command` tells us what kind of file operation is happening
    const command = args.command as string;

    switch (command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
        return `Editing ${path}`;
      case "insert":
        return `Editing ${path}`;
      case "view":
        return `Viewing ${path}`;
      case "undo_edit":
        return `Undoing edit to ${path}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string;

    switch (command) {
      case "rename":
        return `Renaming ${path}`;
      case "delete":
        return `Deleting ${path}`;
      default:
        return toolName;
    }
  }

  // For any tool we don't recognise, fall back to the raw tool name
  return toolName;
}

export function ToolCallLabel({ toolName, args, state }: ToolCallLabelProps) {
  const label = getLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {state === "result" ? (
        // Green dot indicates the tool call finished successfully
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        // Spinning loader shows the tool is still running
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
