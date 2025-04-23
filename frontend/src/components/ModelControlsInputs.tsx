import { useActions } from "../hooks/actions";
import { useAppSelector } from "../hooks/redux";
import { xyz } from "../types/models";

export const ModelControlsInputs = () => {
  const actions = useActions();
  const model = useAppSelector((state) => state.model);
  const modelControls = model.modelControls.models;
  return (
    <div className="flex flex-wrap">
      {Object.keys(modelControls).map((it) => {
        //TODO: remove useGetModels from here, it errors with react hooks not stated number
        const part = model.positions[it];

        return (
          <div key={it} className="p-2 m-2 border-light-background">
            <p>{it.replace(/_/g, " ")}</p>
            <div className="flex gap-3 flex-wrap">
              {modelControls[it].position && (
                <div>
                  <p>Позиция</p>
                  {(
                    Object.keys(modelControls[it].position) as Array<keyof xyz>
                  ).map((axis) => (
                    <div
                      key={`pos-${axis}`}
                      className="flex flex-justify-between"
                    >
                      <span>{axis}</span>
                      <input
                        type="number"
                        value={Number(part.position?.[axis] || 0)}
                        min={
                          Number(modelControls[it]?.position?.[axis]?.[0]) ||
                          -10
                        }
                        max={
                          Number(modelControls[it]?.position?.[axis]?.[1]) || 10
                        }
                        step={0.1}
                        onChange={(e) => {
                          actions.updateModelPositionLocal({
                            command: "set",
                            value: Number(e.target.value),
                            path: `${it}/position/${axis}`,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {modelControls[it].rotation && (
                <div>
                  <p>Поворот</p>
                  {(
                    Object.keys(modelControls[it].rotation) as Array<keyof xyz>
                  ).map((axis) => (
                    <div
                      key={`rot-${axis}`}
                      className="flex flex-justify-between"
                    >
                      <span>{axis}</span>
                      <input
                        type="number"
                        value={Number(part.rotation?.[axis] || 0)}
                        min={
                          Number(modelControls[it].rotation?.[axis]?.[0]) || -10
                        }
                        max={
                          Number(modelControls[it].rotation?.[axis]?.[1]) || 10
                        }
                        step={0.1}
                        onChange={(e) => {
                          actions.updateModelPositionLocal({
                            command: "set",
                            value: Number(e.target.value),
                            path: `${it}/rotation/${axis}`,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
