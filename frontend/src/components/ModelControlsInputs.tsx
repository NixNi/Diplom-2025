import { useActions } from "../hooks/actions";
import { useGetModelPositions } from "../hooks/model";
import { useAppSelector } from "../hooks/redux";

export const ModelControlsInputs = () => {
  const actions = useActions();
  const model = useAppSelector((state) => state.model);
  const modelControls = model.modelControls;
  return (
    <div>
      {modelControls.models.map((it) => {
        const part = useGetModelPositions(it.name)|| {
          name: it.name,
        };

        return (
          <div key={it.name} className="border-1 border-white border-solid p-2">
            <p>{it.name}</p>
            <div className="flex gap-3">
              {it.position && (
                <div>
                  <p>Position</p>
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
                  <p>Rotation</p>
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
