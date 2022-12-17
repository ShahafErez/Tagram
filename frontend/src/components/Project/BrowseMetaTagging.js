import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaTaggingObject from "./MetaTaggingObject";

export default function BrowseMetaTagging() {
  const [metaTaggingList, setMetaTaggingList] = useState();

  useEffect(() => {
    fetch("/api/meta-tagging/all-labels-grouped")
      .then((response) => response.json())
      .then((data) => setMetaTaggingList(data));
  }, []);

  return (
    <div>
      <h1>Browsing</h1>
      {metaTaggingList &&
        metaTaggingList.map((element, index) => (
          <div>
            <h3>{element.title}</h3>
            <MetaTaggingObject metaTagging={element.labels} />
          </div>
        ))}
    </div>
  );
}
