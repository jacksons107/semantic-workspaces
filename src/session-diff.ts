import { Resource, Workspace } from "./workspace";
import { Session } from "./session";

export interface WorkspaceDiff {
  workspace: Workspace;
  isNewWorkspace: boolean;
  newResources: Resource[];
  existingResourceCount: number;
}

export function diffSession(previous: Session | null, next: Session): WorkspaceDiff[] {
  const diffs: WorkspaceDiff[] = [];

  for (const [name, workspace] of next.workspaces) {
    const previousWorkspace = previous?.workspaces.get(name);

    if (!previousWorkspace) {
      diffs.push({
        workspace,
        isNewWorkspace: true,
        newResources: workspace.resources,
        existingResourceCount: 0,
      });
    } else {

      const previousResourceNames = new Set(previousWorkspace.resources.map(r => r.name));
      const newResources = workspace.resources.filter(r => !previousResourceNames.has(r.name));

      diffs.push({
        workspace,
        isNewWorkspace: false,
        newResources,
        existingResourceCount: previousWorkspace.resources.length,
      });
    }
  }

  return diffs;
}
