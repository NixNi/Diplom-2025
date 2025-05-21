export interface xyz {
  x?: number;
  y?: number;
  z?: number;
}

export interface xyzController {
  x?: [number, number];
  y?: [number, number];
  z?: [number, number];
}

export interface ModelPositions {
  [key: string]: {
    position?: xyz;
    rotation?: xyz;
  };
}
export type modelValuePath = ["position" | "rotation", keyof xyz];
export type interfacePositions =
  | "TopLeft"
  | "Top"
  | "TopRight"
  | "Left"
  | "Center"
  | "Right"
  | "BottomLeft"
  | "Bottom"
  | "BottomRight"
  | undefined;
export interface JoystickControlElement {
  name: string;
  element: "Joystick";
  position: interfacePositions;
  props: {
    xpath: string;
    ypath: string;
    topImg?: string;
    bottomImg?: string;
    leftImg?: string;
    rightImg?: string;
  };
}

export type ValuesArray = {
  path: string;
  value: number;
}[];
export interface SetButtonControlElement {
  name: string;
  element: "setButton";
  position: interfacePositions;
  props: {
    values: ValuesArray;
  };
}
export interface SArrowButtonsElement {
  name: string;
  element: "ArrowButtons";
  position: interfacePositions;
  props: {
    type: "up/down" | "left/right";
    path: string;
    topImg?: string;
    bottomImg?: string;
    leftImg?: string;
    rightImg?: string;
  };
}

export interface SPowerButtonElement {
  name: string;
  element: "PowerButton";
  position: interfacePositions;
  props: {
    values: ValuesArray;
  };
}

export interface SEmergencyStopElement {
  name: string;
  element: "EmergencyStop";
  position: interfacePositions;
}

export type controlElement =
  | JoystickControlElement
  | SetButtonControlElement
  | SArrowButtonsElement
  | SPowerButtonElement
  | SEmergencyStopElement;

export interface ModelControls {
  models: {
    [key: string]: { position?: xyzController; rotation?: xyzController };
  };
  controlElements: Array<controlElement>;
}

export interface HardwareState {
  isEnabled?: boolean;
  isControlsEnabled?: boolean;
  isEmergencyStoped?: boolean;
}

export interface CommandResponse {
  command: "set" | "add";
  path: string;
  value: number;
  isNeedOnlineCheck?: boolean;
}
