import { TmuxCommand } from "./tmux-command";

export function stringOfTmuxCommand(cmd: TmuxCommand): string {
    const parts: string[] = ["tmux", cmd.name];
    let argConsumed = false;

    for (const flag of cmd.flags) {
        switch (flag) {
            case "t": parts.push(`-t`, cmd.address!); break;
            case "s": parts.push(`-s`, cmd.arg); argConsumed = true; break;
            case "d": parts.push(`-d`); break;
            case "h": parts.push(`-h`); break;
            case "v": parts.push(`-v`); break;
        }
    }

    if (cmd.bashCommand !== undefined) {
        parts.push(`"${cmd.bashCommand}"`, "Enter");
    } else if (!argConsumed && cmd.arg !== "") {
        parts.push(cmd.arg);
    }

    return parts.join(" ");
}
