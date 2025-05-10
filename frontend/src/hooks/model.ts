import { useAppSelector } from "./redux";

export function useGetCanControl() {
  const model = useAppSelector((state) => state.model);
  return model.isControlsEnabled && model.isEnabled && !model.isEmergencyStoped;
}
