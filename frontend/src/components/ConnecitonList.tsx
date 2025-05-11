import { useState, HTMLAttributes } from "react";
import {
  useDeleteConnectionByIdMutation,
  useGetConnectionsPaginatedQuery,
  useUpdateConnectionByIdMutation,
} from "../store/connect/connect.api";
import "./css/ConnectionList.css";
import SSvgButton from "./shared/SSvgButton";
import DeleteIcon from "../icons/svg/delete.svg?react";
import EditIcon from "../icons/svg/edit.svg?react";
import { Connection } from "../types/connection";
import SPopUp from "./shared/SPopUp";

interface ConnecitonListProps extends HTMLAttributes<HTMLDivElement> {
  handleSubmit: (
    setError: (err: string) => void,
    { ipIn, portIn }: { ipIn?: string; portIn?: string }
  ) => void;
}
export default function ConnecitonList({
  handleSubmit,
  ...ars
}: ConnecitonListProps) {
  const [errorLocal, setErrorLocal] = useState<Record<number, string>>({});
  const [errorLocal2, setErrorLocal2] = useState<Record<number, string>>({});
  const { data, isLoading, isError } = useGetConnectionsPaginatedQuery({
    page: 1,
    perPage: 30,
  });
  const [item, setItem] = useState<Connection | null>(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);

  const [deleteConnection] = useDeleteConnectionByIdMutation();
  const [updateConnection] = useUpdateConnectionByIdMutation();
  return (
    <div className="connection-container">
      {data &&
        data.data.map((it) => {
          return (
            <div
              key={it.id}
              className="connection-item"
              onClick={() => {
                handleSubmit(
                  (e) => {
                    setErrorLocal({ ...errorLocal, [it.id]: e });
                  },
                  { ipIn: it.ip, portIn: it.port }
                );
              }}
            >
              <div>
                <p className="connection-item_title">{it.name}</p>
                <p className="connection-item_adding">
                  {it.ip}:{it.port}
                </p>
              </div>
              {errorLocal && <p className="error">{errorLocal[it.id]}</p>}
              <div className="flex">
                <SSvgButton>
                  <EditIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setItem(it);
                      setEditPopup(true);
                    }}
                  />
                </SSvgButton>
                <SSvgButton>
                  <DeleteIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setItem(it);
                      setDeletePopup(true);
                    }}
                  />
                </SSvgButton>
              </div>
            </div>
          );
        })}
      <SPopUp setVisibility={setDeletePopup} visibility={deletePopup}>
        <h2 className="">
          Вы действительно хотите удалить соединение {item?.name}
        </h2>
        <div className="flex justify-center gap-4">
          <div
            className="btn-accept"
            onClick={() => {
              if (item) deleteConnection(item);
              setDeletePopup(false);
            }}
          >
            Да
          </div>
          <div
            className="btn-accept"
            onClick={() => {
              setDeletePopup(false);
            }}
          >
            Нет
          </div>
        </div>
      </SPopUp>

      <SPopUp setVisibility={setEditPopup} visibility={editPopup}>
        {/* <h3 className="">Изменить соединение {item?.name}</h3> */}
        <label htmlFor="nameInput">
          <p className="ml-2">Название</p>
          <input
            id="nameInput"
            type="text"
            value={item ? item.name : ""}
            onChange={(e) => {
              if (item) setItem({ ...item, name: e.target.value });
            }}
          />
        </label>
        <div className="flex mt-4">
          <label htmlFor="ipInput">
            <p className="ml-2">IP</p>
            <input
              id="ipInput"
              type="text"
              value={item ? item.ip : ""}
              onChange={(e) => {
                if (item) setItem({ ...item, ip: e.target.value });
              }}
            />
          </label>
          <label htmlFor="portInput">
            <p className="ml-2">PORT</p>
            <input
              id="portInput"
              type="text"
              value={item ? item.port : ""}
              onChange={(e) => {
                if (item) setItem({ ...item, port: e.target.value });
              }}
            />
          </label>
        </div>
        {errorLocal2 && item && (
          <p className="error-small">{errorLocal2[item.id]}</p>
        )}
        <div className="flex justify-center gap-4">
          <div
            className="btn-accept"
            onClick={() => {
              if (item)
                updateConnection(item).then((it: any) => {
                  console.log(it);
                  if (!it.error) {
                    setEditPopup(false);
                    setErrorLocal("");
                  } else
                    setErrorLocal2({
                      ...errorLocal2,
                      [item.id]: "Error " + it.error.data.message,
                    });
                });
            }}
          >
            Сохранить
          </div>
          <div
            className="btn-accept"
            onClick={() => {
              setEditPopup(false);
            }}
          >
            Отмена
          </div>
        </div>
      </SPopUp>
    </div>
  );
}
