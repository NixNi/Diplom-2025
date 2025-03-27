import { useEffect, useState } from "react";

interface xyzController {
  x?: [number, number];
  y?: [number, number];
  z?: [number, number];
}
interface modelControls {
  models: Array<{
    name: string;
    position?: xyzController;
    rotation?: xyzController;
  }>;
}

const useModelData = (modelName: string, controls?: boolean) => {
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
  const [modelControls, setModelControls] = useState<modelControls | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Используем RTK Query для управления состоянием запроса

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setIsError(false);
        setErrorMessage(null);
        if (modelName === "") throw new Error("Choose a model");
        const response = await fetch(
          `http://localhost:8046/api/models/${modelName}`
        );
        if (!response.ok) throw new Error("Failed to fetch model data");
        const data = await response.arrayBuffer();
        setModelData(data);
        setIsLoading(false);
        if (controls) {
          const responseControls = await fetch(
            `http://localhost:8046/api/json/${modelName}`
          );
          const cdata = await responseControls.arrayBuffer();
          const json = JSON.parse(new TextDecoder().decode(cdata));
          // console.log(json);
          setModelControls(json);
        }
      } catch (error) {
        const err = error as Error;
        setErrorMessage(err.message);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchModelData();
  }, [modelName]);

  return { modelData, modelControls, isLoading, isError, errorMessage };
};

export default useModelData;
