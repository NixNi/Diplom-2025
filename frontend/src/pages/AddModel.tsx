import { useState } from "react";
import { useAddModelMutation } from "../store/model/model.api";
import ModelPreview from "../components/ModelPreview";
import { useNavigate } from "react-router-dom";

const AddModel = () => {
  const [modelName, setModelName] = useState("");
  const [modelFile, setModelFile] = useState<ArrayBuffer | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addModel, { isLoading }] = useAddModelMutation();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          setModelFile(e.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!modelName || !modelFile) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      await addModel({ name: modelName, data: modelFile }).unwrap();
      navigate("/"); // Перенаправляем на главную страницу после успешной загрузки
    } catch (error) {
      setErrorMessage("Ошибка при загрузке модели.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Добавить модель</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Название модели
          </label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Файл модели
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        {modelFile && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Предпросмотр модели
            </label>
            <ModelPreview model={modelFile} />
          </div>
        )}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? "Загрузка..." : "Добавить модель"}
        </button>
      </form>
    </div>
  );
};

export default AddModel;
