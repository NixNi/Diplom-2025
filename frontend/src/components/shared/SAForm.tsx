import React, { FormEvent, useEffect, useState } from "react";
import SLInput, { SLInputProps } from "./SLInput";
import SLTextArea from "./SLTextArea";
import SLSelect from "./SLSelect";
import SButton from "./SButton";

interface inputs extends Omit<SLInputProps, "onChange"> {
  options?: [string, number][];
}
interface SAFormProps {
  onSubmit: (e: FormEvent) => void;
  setFormData: (e: Record<string, string>) => void;
  inputs: inputs[];
  button: string;
  children?: React.ReactNode;
}

export default function SAForm(props: SAFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    props.inputs.reduce((acc: Record<string, string>, rec) => {
      acc[rec.name] = rec.value || "";
      return acc;
    }, {})
  );

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    props.setFormData(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.onSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full h-full py-6 flex justify-center items-center gap-2 flex-col"
    >
      {props.inputs.map((it, index) => (
        <React.Fragment key={index}>
          {it.type === "textarea" ? (
            <SLTextArea
              {...it}
              onChange={handleChange}
              value={formData[it.name]}
            />
          ) : it.type === "select" ? (
            <SLSelect
              {...it}
              onChange={handleChange}
              value={formData[it.name]}
            />
          ) : (
            <SLInput
              key={index}
              {...it}
              onChange={handleChange}
              value={formData[it.name]}
            />
          )}
        </React.Fragment>
      ))}

      {props.children}
      <SButton type="submit">{props.button}</SButton>
    </form>
  );
}

// return (
//   <form
//     onSubmit={onSubmit}
//     className="w-full h-full py-6 flex justify-center items-center gap-2 flex-col"
//   >
//     {props.inputs.map((it, index) => (
//       <SLInput key={index} {...it} onChange={handleChange} />
//     ))}

//     {props.children}
//     <SButton type="submit">{props.button}</SButton>
//   </form>
// );
//}
