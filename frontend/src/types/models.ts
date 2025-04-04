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
export interface ControlElement {
  name: string;
  element: string;
  props: {
    x: string;
    y: string;
    xpath: ["position" | "rotation", keyof xyz];
    ypath: ["position" | "rotation", keyof xyz];
  };
}
export interface ModelControls {
  models: Array<{
    name: string;
    position?: xyzController;
    rotation?: xyzController;
  }>;
  controlElements: Array<ControlElement>;
}
