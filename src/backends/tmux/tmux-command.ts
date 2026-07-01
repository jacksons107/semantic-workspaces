/**
 * Example commands to start a new session called 'parser' with multiple panes that
 * have different resource types.
 * 
tmux kill-session -t parser

tmux new-session -d -s parser

tmux split-window -t parser:0 -h

tmux split-window -t parser:0 -v

tmux select-layout -t parser:0 tiled

tmux send-keys -t parser:0.0 "nvim src/parser.ts" Enter

tmux send-keys -t parser:0.1 "nvim src/lexer.ts" Enter

tmux send-keys -t parser:0.2 "node" Enter
 */

export interface TmuxCommand {
  name: TmuxCommandName;
  flags: TmuxFlags[];
  arg: string;
  address?: string;
  bashCommand?: string;
}

type TmuxCommandName =
  | "kill-session"
  | "new-session"
  | "split-window"
  | "select-layout"
  | "send-keys"

type TmuxFlags =
  | "t"
  | "d"
  | "s"
  | "h"
  | "v"
