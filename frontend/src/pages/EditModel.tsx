import { useEffect, useState } from "react";
import { useUpdateModelByNameMutation } from "../store/model/model.api";
import ModelPreview from "../components/ModelPreview";
import SLSelect from "../components/shared/SLSelect";
import { useActions } from "../hooks/actions";
import { useGetAllModelNamesQuery } from "../store/model/model.api";

const EditModel = () => {
  //TODO: Fix model loading after error
  const [modelName, setModelName] = useState("");
  const [modelFile, setModelFile] = useState<ArrayBuffer | null>(null);
  const [settingsFile, setSettingsFile] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [updateModel] = useUpdateModelByNameMutation();
  const [inputFileKey, setInputFileKey] = useState<number>(Date.now());
  const [inputSettingsKey, setInputSettingsKey] = useState<number>(Date.now());
  const actions = useActions();

  const [modelOptions, setModelOptions] = useState<
    Array<{ value: string; name: string; disable?: boolean }>
  >([]);
  const {
    data,
    isLoading: isNamesLoading,
    isError: isNamesError,
  } = useGetAllModelNamesQuery();

  useEffect(() => {
    actions.resetModelState();
  }, []);

  useEffect(() => {
    if (isNamesLoading || isNamesError) return;
    setModelOptions([
      { value: "default", name: "default", disable: true },
      ...(data?.data?.map((it) => ({ value: it.name, name: it.name })) || []),
    ]);
  }, [isNamesError, isNamesLoading, data?.data]);

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
    if (!modelName && modelName !== "default") {
      setErrorMessage("Пожалуйста, выберите модель.");
      return;
    }
    if (internalError) {
      setErrorMessage("Пожалуйста, загрузите модель без ошибок.");
      return;
    }
    try {
      console.log({
        name: modelName,
        data: modelFile,
        settings: settingsFile,
      });
      await updateModel({
        name: modelName,
        data: modelFile,
        settings: settingsFile,
      }).unwrap();
    } catch (error) {
      setErrorMessage("Ошибка при загрузке модели.");
    }
  };

  return (
    <div className="p-4 flex flex-justify-between">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl mb-4">Редактировать модель</h1>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Название модели
          </label>
          <SLSelect
            className=""
            name="modelName"
            onChange={async (e) => {
              setModelFile(null);
              setSettingsFile(null);
              setInputFileKey(Date.now());
              setInputSettingsKey(Date.now());
              setModelName(e.target.value);
              actions.setModelName(e.target.value);
              actions.updateModelControlsAsync();
            }}
            text="Выберите модель"
            options={modelOptions}
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
          />
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {internalError && <p className="text-red-500">{internalError}</p>}
        <button
          type="submit"
          className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md secondary-hover"
        >
          Сохранить
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setModelFile(null);
            setSettingsFile(null);
            setInputFileKey(Date.now());
            setInputSettingsKey(Date.now());
          }}
          className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md secondary-hover"
        >
          Отмена
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setModelFile(null);
            setSettingsFile(null);
            setInputFileKey(Date.now());
            setInputSettingsKey(Date.now());
          }}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md warning-hover color-black"
        >
          Удалить
        </button>
      </form>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Предпросмотр модели
        </label>
        <ModelPreview model={modelFile} setExternalError={setInternalError} />
      </div>
    </div>
  );
};

export default EditModel;
