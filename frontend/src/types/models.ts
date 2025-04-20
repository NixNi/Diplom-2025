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
  models: Array<{
    name: string;
    position?: xyz;
    rotation?: xyz;
  }>;
}
export type modelValuePath = ["position" | "rotation", keyof xyz];
export interface JoystickControlElement {
  name: string;
  element: "Joystick";
  props: {
    x: string;
    y: string;
    xpath: modelValuePath;
    ypath: modelValuePath;
  };
}
export interface SetButtonControlElement {
  name: string;
  element: "setButton";
  props: {
    values: [
      {
        element: string;
        path: modelValuePath;
        value: number;
      }
    ];
  };
}
export interface SArrowButtonsElement {
  name: string;
  element: "ArrowButtons";
  props: {
    type: "up/down" | "left/right";
    element: string;
    path: modelValuePath;
  };
}

export interface SPowerButtonElement {
  name: string;
  element: "PowerButton";
  props: {
    defaultValues: [
      {
        element: string;
        path: modelValuePath;
        value: number;
      }
    ];
  };
}

export interface SEmergencyStopElement {
  name: string;
  element: "EmergencyStop";
}

export type controlElement =
  | JoystickControlElement
  | SetButtonControlElement
  | SArrowButtonsElement
  | SPowerButtonElement
  | SEmergencyStopElement;
  
export interface ModelControls {
  models: Array<{
    name: string;
    position?: xyzController;
    rotation?: xyzController;
  }>;
  controlElements: Array<controlElement>;
}
