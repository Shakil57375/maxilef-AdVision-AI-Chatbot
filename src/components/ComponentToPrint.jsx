
import React from "react";
import "./style.css"; // Import Quill styles
// eslint-disable-next-line react/display-name
export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { data } = props;


  return (
    <div ref={ref} >
      <div
      
        style={{ margin: 40 }}
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
});
