import { HTMLAttributes } from "react";
export interface STabProps extends HTMLAttributes<HTMLDivElement> {
  default?: boolean;
  title: string;
}

const STab = (props: STabProps) => {
  return <div className={"Tab" + props.className}>{props.children}</div>;
};

export default STab;
