import { useEffect, useState } from "react";
import { useAddModelMutation } from "../store/model/model.api";
import ModelPreview from "../components/ModelPreview";
import { useActions } from "../hooks/actions";
import SettingsViewer from "../components/SettingsViewer";

const AddModel = () => {
  //TODO: Fix model loading after error
  const [modelName, setModelName] = useState("");
  const [modelFile, setModelFile] = useState<ArrayBuffer | null>(null);
  const [settingsFile, setSettingsFile] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [inputFileKey, setInputFileKey] = useState<number>(Date.now());
  const [inputSettingsKey, setInputSettingsKey] = useState<number>(Date.now());
  const [addModel, { isLoading }] = useAddModelMutation();
  const actions = useActions();

  useEffect(() => {
    actions.resetModelState();
  }, []);

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

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setSettingsFile(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!modelName || !modelFile || !settingsFile) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }
    if (internalError) {
      setErrorMessage("Пожалуйста, загрузите модель без ошибок.");
      return;
    }
    try {
      await addModel({
        name: modelName,
        data: modelFile,
        settings: settingsFile,
      }).unwrap();
      setModelName("");
      setModelFile(null);
      setSettingsFile(null);
      setInputFileKey(Date.now());
      setInputSettingsKey(Date.now());
    } catch (error) {
      setErrorMessage("Ошибка при загрузке модели.");
    }
  };

  return (
    <div className="p-4 flex flex-justify-between">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl mb-4">Добавить модель</h1>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Название модели
          </label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Файл модели
          </label>
          <input
            type="file"
            key={inputFileKey}
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            accept=".glb"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Файл настроек
          </label>
          <input
            type="file"
            key={inputSettingsKey}
            onChange={handleFileChange2}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            accept=".json"
            required
          />
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {internalError && <p className="text-red-500">{internalError}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md secondary-hover"
        >
          {isLoading ? "Загрузка..." : "Добавить модель"}
        </button>
      </form>
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Предпросмотр настроек управления
        </label>
        <SettingsViewer settings={settingsFile} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Предпросмотр модели
        </label>
        <ModelPreview model={modelFile} setExternalError={setInternalError} />
      </div>
    </div>
  );
};

export default AddModel;
