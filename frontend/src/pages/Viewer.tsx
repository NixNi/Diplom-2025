import ModelViewer from "../components/ModelViewer";
import SLSelect from "../components/shared/SLSelect";

import { useEffect, useState } from "react";
import { useGetAllModelNamesQuery } from "../store/model/model.api";

export default function Viewer() {
  const [modelName, setModelName] = useState("");
  const [modelOptions, setModelOptions] = useState<
    Array<{ value: string; name: string }>
  >([]);
  const { data, isLoading, isError } = useGetAllModelNamesQuery();

  useEffect(() => {
    if (isLoading || isError) return;
    setModelOptions([
      { value: "default", name: "default" },
      ...(data?.data?.map((it) => ({ value: it.name, name: it.name })) || []),
    ]);
  }, [isLoading, isError]);

  return (
    <div>
      <ModelViewer modelName={modelName} />
      {!isLoading && (
        <SLSelect
          name="modelName"
          onChange={(e) => setModelName(e.target.value)}
          text="Выберите модель"
          options={modelOptions}
        />
      )}
    </div>
  );
}
