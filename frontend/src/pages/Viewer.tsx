import ModelViewer from "../components/ModelViewer";
import SLSelect from "../components/shared/SLSelect";

import { useEffect, useState } from "react";
import { useGetAllModelNamesQuery } from "../store/model/model.api";
import { useActions } from "../hooks/actions";
import SStatusIndicator from "../components/shared/SStatusIndicator";

export default function Viewer() {
  const [modelOptions, setModelOptions] = useState<
    Array<{ value: string; name: string; disable?: boolean }>
  >([]);
  const { data, isLoading, isError } = useGetAllModelNamesQuery();
  const actions = useActions();
  useEffect(() => {
    actions.resetModelState();
  }, []);

  useEffect(() => {
    if (isLoading || isError) return;
    setModelOptions([
      { value: "default", name: "default", disable: true },
      ...(data?.data?.map((it) => ({ value: it.name, name: it.name })) || []),
    ]);
  }, [isLoading, isError, data?.data]);

  return (
    <div>
      <ModelViewer modelControlsEnable>
        {!isLoading && (
          <>
            <SStatusIndicator className="absolute right-2 top-1" />
            <SLSelect
              className="absolute bottom-0"
              name="modelName"
              onChange={async (e) => {
                actions.setModelName(e.target.value);
                actions.updateModelControlsAsync();
              }}
              text="Выберите модель"
              options={modelOptions}
            />
          </>
        )}
      </ModelViewer>
    </div>
  );
}
