import SInput from './SInput';
export interface SLInputProps {
  text: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  value?: string;
}
export default function SLInput(props: SLInputProps) {
  return (
    <>
      <label htmlFor={props.name} className="mx-2">
        {props.text}
      </label>
      <SInput
        type={props.type}
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        id={props.name}
      />
    </>
  );
}
