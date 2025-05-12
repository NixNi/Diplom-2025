import { useAppSelector } from "../hooks/redux";
import "./css/SettingsViewer.css";
interface SettingsViewerProps {
  settings?: string | null;
}

const SettingsViewer = ({ settings }: SettingsViewerProps) => {
  const model = useAppSelector((state) => state.model);

  return (
    <div className="code-textarea-wrapper">
      <textarea
        className="code-textarea"
        name="settings"
        id="settings"
        readOnly
        value={settings || JSON.stringify(model.modelControls, null, 2)}
      ></textarea>
    </div>
  );
};

export default SettingsViewer;
