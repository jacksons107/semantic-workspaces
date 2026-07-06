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
    case "diff": {
      const parts = ["git", "diff"];
      if (resource.ref) parts.push(resource.ref);
      if (resource.paths.length > 0) parts.push("--", ...resource.paths);
      parts.push("| delta");
      return parts.join(" ");
    }
  }
}
