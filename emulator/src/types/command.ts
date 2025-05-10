export interface Command {
  command: "set" | "add";
  path: string;
  value: number;
}

export interface HardwareState {
  isEnabled?: boolean;
  isControlsEnabled?: boolean;
  isEmergencyStoped?: boolean;
}