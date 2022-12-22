import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MetaTaggingObject from "./MetaTaggingObject";

export default function ProjectPage() {
  let { id } = useParams();
  const [project, setProject] = useState({
    title: "",
    description: "",
    is_project_manager: false,
    created_at: "",
  });
  const [metaTaggingLabels, setMetaTaggingLabels] = useState();

  useEffect(() => {
    let meta_tagging_id = "";

    fetch("/api/project/get?project_id=" + id)
      .then((response) => response.json())
      .then((data) => {
        setProject(data);
        meta_tagging_id = data.meta_tagging;
      })
      .then(() =>
        fetch(
          "/api/meta-tagging/labels-by-id?meta-tagging-id=" + meta_tagging_id
        )
      )
      .then((response) => response.json())
      .then((data) => setMetaTaggingLabels(data));

    // we need to put [] as the second argument, if we want to render only once
  }, []);

  return (
    <div
      class="card"
      style={{ textAlign: "center", width: "50%", margin: "auto" }}
    >
      <div class="card-body">
        <h2 class="card-title">{project.title}</h2>
        <p class="card-text">
          {" "}
          <b>Project Id:</b> {id}
        </p>
        {project.description != "" && (
          <p class="card-text">
            {" "}
            <b>Description: </b>
            {project.description}
          </p>
        )}
        <p class="card-text">
          {" "}
          <b>Is the manager: </b>
          {String(project.is_project_manager)}
        </p>
        <p class="card-text">
          {" "}
          <b>Creation date:</b> {project.created_at}
        </p>
      </div>
      <MetaTaggingObject metaTagging={metaTaggingLabels} />
    </div>
  );
}
