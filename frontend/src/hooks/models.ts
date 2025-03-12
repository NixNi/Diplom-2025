import { useEffect, useState } from "react";

const useModelData = (modelName: string) => {
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Используем RTK Query для управления состоянием запроса

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8046/api/models/${modelName}`
        );
        if (!response.ok) throw new Error("Failed to fetch model data");
        const data = await response.arrayBuffer();
        setModelData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading model:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchModelData();
  }, [modelName]);

  return { modelData, isLoading, isError };
};

export default useModelData;
