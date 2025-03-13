export interface SLSelectProps {
  text: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: Array<{ value: string; name: string }>;
  value?: string;
}

export default function SLSelect(props: SLSelectProps) {
  return (
    <>
      <label htmlFor={props.name} className="mx-2">
        {props.text}
      </label>
      <select
        className="p-1 border border-white"
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        id={props.name}
      >
        {props.options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
}
