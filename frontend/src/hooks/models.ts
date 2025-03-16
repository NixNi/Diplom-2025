import { useEffect, useState } from "react";

const useModelData = (modelName: string) => {
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
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
        response.status;
        if (!response.ok) throw new Error("Failed to fetch model data");
        const data = await response.arrayBuffer();
        setModelData(data);
        setIsLoading(false);
      } catch (error) {
        const err = error as Error;
        setErrorMessage(err.message)
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchModelData();
  }, [modelName]);

  return { modelData, isLoading, isError, errorMessage };
};

export default useModelData;
