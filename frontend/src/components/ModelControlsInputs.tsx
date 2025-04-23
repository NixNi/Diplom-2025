import { useActions } from "../hooks/actions";
import { useGetModelPositions } from "../hooks/model";
import { useAppSelector } from "../hooks/redux";

export const ModelControlsInputs = () => {
  const actions = useActions();
  const model = useAppSelector((state) => state.model);
  const modelControls = model.modelControls;
  return (
    <div className="flex flex-wrap">
      {modelControls.models.map((it) => {
        //TODO: remove useGetModels from here, it errors with react hooks not stated number
        const part = useGetModelPositions(it.name) || {
          name: it.name,
        };

        return (
          <div key={it.name} className="p-2 m-2 border-light-background">
            <p>{it.name.replace(/_/g, " ")}</p>
            <div className="flex gap-3 flex-wrap">
              {it.position && (
                <div>
                  <p>Позиция</p>
                  {(
                    Object.keys(it.position) as Array<keyof typeof it.position>
                  ).map((axis) => (
                    <div
                      key={`pos-${axis}`}
                      className="flex flex-justify-between"
                    >
                      <span>{axis}</span>
                      <input
                        type="number"
                        value={Number(part.position?.[axis] || 0)}
                        min={Number(it.position?.[axis]?.[0]) || -1000}
                        max={Number(it.position?.[axis]?.[1]) || 1000}
                        step={0.1}
                        onChange={(e) => {
                          const partd = { ...part };
                          partd.position = { ...partd.position };
                          partd.position[axis] = Number(e.target.value);
                          actions.updateModelPositionLocal(partd);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {it.rotation && (
                <div>
                  <p>Поворот</p>
                  {(
                    Object.keys(it.rotation) as Array<keyof typeof it.rotation>
                  ).map((axis) => (
                    <div
                      key={`rot-${axis}`}
                      className="flex flex-justify-between"
                    >
                      <span>{axis}</span>
                      <input
                        type="number"
                        value={Number(part.rotation?.[axis] || 0)}
                        min={Number(it.rotation?.[axis]?.[0]) || -1000}
                        max={Number(it.rotation?.[axis]?.[1]) || 1000}
                        step={0.1}
                        onChange={(e) => {
                          const partd = { ...part };
                          partd.rotation = { ...partd.rotation };
                          partd.rotation[axis] = Number(e.target.value);
                          actions.updateModelPositionLocal(partd);
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
