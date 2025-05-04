import STab from "../components/shared/STab";
import STabViewer from "../components/shared/STabViewer";
import AddModel from "./AddModel";
import Viewer from "./Viewer";

export default function Settings() {
  return (
    <STabViewer tabsPosition="left">
      <STab title="Просмотр моделей" default>
        <Viewer />
      </STab>
      <STab title="Загрузить модель">
        <AddModel />
      </STab>
    </STabViewer>
  );
}
