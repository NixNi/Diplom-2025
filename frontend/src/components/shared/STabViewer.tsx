import { HTMLAttributes, ReactElement, useEffect, useState } from "react";
import { STabProps } from "./STab";
import "./css/STab.css";

interface STabViewerProps extends HTMLAttributes<HTMLDivElement> {
  tabsPosition?: "top" | "left";
  children?: ReactElement<STabProps>[];
}

const STabViewer = ({
  tabsPosition = "top",
  children,
  ...rest
}: STabViewerProps) => {
  const [tabs, setTabs] = useState<{ [key: string]: ReactElement<STabProps> }>(
    {}
  );
  const [tab, setTab] = useState<string | null>(null);
  useEffect(() => {
    setTabs({
      ...(children?.reduce((acc, rec) => {
        if (rec.props.default) setTab(rec.props.title);
        return { ...acc, [rec.props.title]: rec };
      }, {}) || {}),
    });
  }, []);

  return (
    <div {...rest} className={`tabs-viewer ${tabsPosition} ` + rest.className}>
      <div className="tabs-titles-container">
        {Object.keys(tabs).map((it) => (
          <div
            key={it}
            className={"tab-title " + ((it == tab && "active") || "")}
            onClick={() => {
              setTab(it);
            }}
          >
            {it}
          </div>
        ))}
      </div>
      <div className="tabs-container">{tab && tabs[tab]}</div>
    </div>
  );
};

export default STabViewer;
