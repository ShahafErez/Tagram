import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MetaTaggingObject from "./MetaTaggingObject";
import AnnotationTag from "./AnnotationTypes/AnnotationTag";
import AnnotationRelation from "./AnnotationTypes/AnnotationRelation";
import AnnotationCoOccurrence from "./AnnotationTypes/AnnotationCoOccurrence";

export default function ProjectPage() {
  let { id } = useParams();
  const [project, setProject] = useState({
    title: "",
    description: "",
    is_project_manager: false,
    created_at: "",
  });
  const [file, setFile] = useState({
    file_id: "",
    file: "",
    text: "",
  });

  // settings arrays for labels & labels types
  const [metaTaggingLabels, setMetaTaggingLabels] = useState([]);
  const [tagsLabels, setTagsLabels] = useState([]);
  const [relationsLabels, setRelationsLabels] = useState([]);

  const [isAnnotateTags, setIsAnnotateTags] = useState(false);
  const [isAnnotateRelations, setIsAnnotateRelations] = useState(false);
  const [isAnnotateCoOccurrence, setIsAnnotateCoOccurrence] = useState(true);

  const [relationSummary, setRelationSummary] = useState([]);
  const [tagsSummary, settagsSummary] = useState([]);
  const [relationCurrentState, setRelationCurrentState] = useState([]);
  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState([]);

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

  // [[tagsSummary] , [relationSummary]] output
  const exportToFile = () => {
    const fileData = JSON.stringify([tagsSummary].concat([relationSummary]));
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "allTagging.json";
    link.href = url;
    link.click();
  };

  const saveAnnotation = () => {
    fetch("/api/project/save-annotation", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        project_id: id,
        file_id: file.file_id,
        tags: tagsSummary,
        relations: relationSummary,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

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
                setIsAnnotateCoOccurrence(false);
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
                setIsAnnotateCoOccurrence(false);
              }}
            >
              Annotate Relations
            </button>
            <button
              type="button"
              class="btn btn-outline-primary"
              onClick={() => {
                setIsAnnotateCoOccurrence(true);
                setIsAnnotateRelations(false);
                setIsAnnotateTags(false);
              }}
            >
              Annotate Co-Occurrence
            </button>
          </div>
          {tagsLabels.length > 0 && isAnnotateTags && (
            <AnnotationTag
              file={file}
              labels={tagsLabels}
              tagsSummary={tagsSummary}
            />
          )}
          {relationsLabels.length > 0 && isAnnotateRelations && (
            <AnnotationRelation
              file={file}
              labels={relationsLabels}
              coOccurrenceSummary={relationSummary}
              relationCurrentState={relationCurrentState}
            />
          )}
          {isAnnotateCoOccurrence && (
            <AnnotationCoOccurrence
              file={file}
              labels={relationsLabels}
              coOccurrenceSummary={coOccurrenceSummary}
            />
          )}
        </div>
        <br></br>
        <button id="exportAllTaggingBtn" onClick={exportToFile}>
          Export All Tagging to File
        </button>
        <br></br>
        <br></br>
        <br></br>
        <button id="saveAllTaggingBtn" onClick={saveAnnotation}>
          Save All
        </button>
      </div>
    </div>
  );
}
