import { useEffect } from "react";
import STab from "../components/shared/STab";
import STabViewer from "../components/shared/STabViewer";
import { useActions } from "../hooks/actions";
import AddModel from "./AddModel";
import Viewer from "./Viewer";
import EditModel from "./EditModel";

export default function Settings() {
  const actions = useActions();
  useEffect(() => {
    actions.setMode("offline");
  }, []);
  return (
    <STabViewer tabsPosition="left">
      <STab title="Просмотр моделей" default>
        <Viewer />
      </STab>
      <STab title="Загрузить модель">
        <AddModel />
      </STab>
      <STab title="Редактировать модель">
        <EditModel />
      </STab>
    </STabViewer>
  );
}
