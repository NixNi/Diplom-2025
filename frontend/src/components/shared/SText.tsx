import React from 'react'

export default function SText(props: { text: string; className?: string }) {
  const formatTextWithBreaks = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  return <p className={props.className}>{formatTextWithBreaks(props.text)}</p>;
}
