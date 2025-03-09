export interface SLTextAreaProps {
  text: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
}

export default function SLTextArea(props: SLTextAreaProps) {
  return (
    <>
      <label htmlFor={props.name} className="mx-2">
        {props.text}
      </label>
      <textarea
        className="p-1 border border-white"
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        id={props.name}
      />
    </>
  );
}
