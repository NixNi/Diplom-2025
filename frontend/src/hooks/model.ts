import { useAppSelector } from "./redux";

export function useGetModelPositions(name: string) {
  const positions = useAppSelector((state) => state.model.positions);
  return positions.models.find((it) => it.name === name);
}

export function useGetModelControls(name: string) {
  const modelControls = useAppSelector((state) => state.model.modelControls);
  return modelControls.models.find((it) => it.name === name);
}

export function useGetCanControl() {
  const model = useAppSelector((state) => state.model);
  return model.isControlsEnabled && model.isEnabled && !model.isEmergencyStoped;
}
