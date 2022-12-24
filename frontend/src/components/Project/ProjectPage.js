import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MetaTaggingObject from "./MetaTaggingObject";
import AnnotationTag from "./AnnotationTag";
import AnnotationRelation from "./AnnotationRelation";

export default function ProjectPage() {
  let { id } = useParams();
  const [project, setProject] = useState({
    title: "",
    description: "",
    is_project_manager: false,
    created_at: "",
  });
  const [file, setFile] = useState({
    file: "",
    project_id: "",
    text: "",
  });

  // settings arrays for labels & labels types
  const [metaTaggingLabels, setMetaTaggingLabels] = useState([]);
  const [tagsLabels, setTagsLabels] = useState([]);
  const [relationsLabels, setRelationsLabels] = useState([]);

  const [isAnnotateTags, setIsAnnotateTags] = useState(false);
  const [isAnnotateRelations, setIsAnnotateRelations] = useState(false);

  const [relationSummarry, setRelationSummary] = useState([]);
  const [tagsSummarry, settagsSummary] = useState([]);

  // getting project details
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
      .then((data) => {
        setMetaTaggingLabels(data);
        let tags = [];
        let relations = [];
        data.forEach(function (label, index) {
          // adding the labels to the correct type
          if (label["type"] == "Tag") {
            tags.push(label);
          }
          if (label["type"] == "Relation") {
            relations.push(label);
          }
        });
        setTagsLabels(tags);
        setRelationsLabels(relations);
      });
    // we need to put [] as the second argument, if we want to render only once
  }, []);

  // getting project file
  useEffect(() => {
    fetch("/api/project/get-file?project_id=" + id)
      .then((response) => {
        if (!response.ok) {
          console.log("response not OK");
        }
        return response.json();
      })
      .then((data) => {
        setFile(data);
      });
  }, []);

  return (
    <div
      class="card project-page"
      style={{
        textAlign: "center",
        width: "50%",
        margin: "auto",
        minHeight: "500px",
      }}
    >
      <div class="card-body">
        <h2 class="card-title">{project.title}</h2>

        {project.description != "" && (
          <p class="card-text">{project.description}</p>
        )}

        {metaTaggingLabels.length > 0 && (
          <MetaTaggingObject metaTagging={metaTaggingLabels} />
        )}

        <div>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              class="btn btn-outline-primary"
              onClick={() => {
                setIsAnnotateTags(true);
                setIsAnnotateRelations(false);
              }}
            >
              Annotate Tags
            </button>
            <button
              type="button"
              class="btn btn-outline-primary"
              onClick={() => {
                setIsAnnotateRelations(true);
                setIsAnnotateTags(false);
              }}
            >
              Annotate Relations
            </button>
          </div>
          {tagsLabels.length > 0 && isAnnotateTags && (
            <AnnotationTag file={file} labels={tagsLabels} tagsSummarry={tagsSummarry}/>
          )}
          {relationsLabels.length > 0 && isAnnotateRelations && (
            <AnnotationRelation file={file} labels={relationsLabels} relationSummarry={relationSummarry} />
          )}
        </div>
      </div>
    </div>
  );
}
