import React, { useEffect, useState } from "react";

export default function PreojctPreview(props) {
  let project = props.project;

  const [metaTaggingTitle, setMetaTaggingTitle] = useState();

  // getting all the labels gouped by meta tagging id on loading
  useEffect(() => {
    fetch("/api/meta-tagging/get?id=" + project.meta_tagging)
      .then((response) => response.json())
      .then((data) => {
        setMetaTaggingTitle(data.title);
      });
  }, []);

  return (
    <div class="card project-preview">
      <h4 class="card-title" style={{ color: "#476fb8" }}>
        {project.title}
      </h4>
      {project.description != "" && <h5>{project.description}</h5>}
      <h5>
        Meta Tagging<span style={{ color: "#0c6cfc" }}>: </span>
        {metaTaggingTitle}
      </h5>
    </div>
  );
}
