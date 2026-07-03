import { spawn, ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface, Interface } from "node:readline";
import { parseControlModeLine, ControlModeEvent } from "./parse-control-mode-line";
import { TMUX_ANCHOR_SESSION } from "../tmux/tmux-command";

interface PendingCommand {
  resolve: (result: { ok: boolean; lines: string[] }) => void;
}

// Wraps a single persistent `tmux -C` process. Commands are sent over stdin and
// replies arrive on stdout as %begin/%end/%error blocks in the same order the
// commands were sent, so a FIFO queue is enough to match replies to callers.
export class TmuxControlConnection {
  private readonly process: ChildProcessWithoutNullStreams;
  private readonly rl: Interface;
  private readonly pending: PendingCommand[] = [];
  private readonly notifications: ControlModeEvent[] = [];
  private currentBlock: string[] | null = null;
  // Launching `tmux -C new-session ...` runs a command of its own before we send
  // any of ours, so the first reply block on stdout belongs to that implicit
  // launch, not to our first sendCommand call — it must be discarded, not queued.
  private sawLaunchReply = false;

  // Defaults to the same anchor session name the workspace-command compiler
  // targets, so windows created via sendCommand land in this connection's session.
  constructor(anchorSessionName: string = TMUX_ANCHOR_SESSION) {
    this.process = spawn("tmux", ["-C", "new-session", "-A", "-s", anchorSessionName]);
    this.rl = createInterface({ input: this.process.stdout });
    this.rl.on("line", (line) => this.handleLine(line));
  }

  private handleLine(line: string): void {
    const event = parseControlModeLine(line);

    switch (event.kind) {
      case "begin":
        this.currentBlock = [];
        break;

      case "end":
      case "error": {
        if (!this.sawLaunchReply) {
          this.sawLaunchReply = true;
          this.currentBlock = null;
          break;
        }

        const pending = this.pending.shift();
        pending?.resolve({ ok: event.kind === "end", lines: this.currentBlock ?? [] });
        this.currentBlock = null;
        break;
      }

      case "output-line":
        this.currentBlock?.push(event.text);
        break;

      case "notification":
        this.notifications.push(event);
        break;
    }
  }

  sendCommand(line: string): Promise<{ ok: boolean; lines: string[] }> {
    return new Promise((resolve) => {
      this.pending.push({ resolve });
      this.process.stdin.write(line + "\n");
    });
  }

  close(): void {
    this.rl.close();
    this.process.kill();
  }
}
