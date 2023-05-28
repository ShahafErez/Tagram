import React, { useEffect, useState } from "react";

export default function CompareAnnotations(props) {
  let automationResult = props.automationResult;
  const [taggersAnnotations, setTaggersAnnotations] = useState();

  useEffect(() => {
    // TODO- getting project annotations
    setTaggersAnnotations(null);
  }, []);

  return (
    <div>
      <h4 style={{ fontSize: "18px", fontWeight: "500" }}>
        Comparing Annotation
      </h4>
    </div>
  );
}
