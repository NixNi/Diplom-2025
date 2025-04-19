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

export type controlElement = JoystickControlElement | SetButtonControlElement;
export interface ModelControls {
  models: Array<{
    name: string;
    position?: xyzController;
    rotation?: xyzController;
  }>;
  controlElements: Array<controlElement>;
}

