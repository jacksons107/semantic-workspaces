import { Resource } from "../workspace";

export function bashCommandOfResource(resource: Resource): string {
  switch (resource.kind) {
    case "editor":
      return `nvim ${resource.file}`;
    case "repl":
      switch (resource.language) {
        case "typescript": return "npx ts-node";
        case "python": return "python3";
      }
    case "agent":
      switch (resource.agent) {
        case "claude": return "claude";
        case "codex": return "codex";
      }
  }
}
