import ModelViewer from "../components/ModelViewer";
import SLSelect from "../components/shared/SLSelect";

import { useEffect, useState } from "react";
import { useGetAllModelNamesQuery } from "../store/model/model.api";
import { useActions } from "../hooks/actions";
import { useAppDispatch } from "../store";
import { updateModelDataAsync } from "../store/model/model.slice";

export default function Viewer() {
  const [modelOptions, setModelOptions] = useState<
    Array<{ value: string; name: string; disable?: boolean }>
  >([]);
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
  const { data, isLoading, isError } = useGetAllModelNamesQuery();
  const actions = useActions();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading || isError) return;
    setModelOptions([
      { value: "default", name: "default", disable: true },
      ...(data?.data?.map((it) => ({ value: it.name, name: it.name })) || []),
    ]);
  }, [isLoading, isError, data?.data]);

  return (
    <div>
      <ModelViewer modelData={modelData} modelControlsEnable />
      {!isLoading && (
        <SLSelect
          name="modelName"
          onChange={async (e) => {
            actions.setModelName(e.target.value);
            actions.updateModelControlsAsync();
            try {
              const result = await dispatch(updateModelDataAsync()).unwrap();
              setModelData(result); // Сохраняем modelData в локальном состоянии
            } catch (error) {
              console.error("Failed to load model data:", error);
            }
          }}
          text="Выберите модель"
          options={modelOptions}
        />
      )}
      {/* <SArrowCross/> */}
    </div>
  );
}
