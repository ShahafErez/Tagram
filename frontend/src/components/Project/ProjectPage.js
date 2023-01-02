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

  const [isAnnotateTags, setIsAnnotateTags] = useState(true);
  const [isAnnotateRelations, setIsAnnotateRelations] = useState(false);
  const [isAnnotateCoOccurrence, setIsAnnotateCoOccurrence] = useState(false);

  // setting the summary and current state for each annotation type
  const [tagsSummary, setTagsSummary] = useState();
  const [tagCurrentState, setTagCurrentState] = useState();
  const [relationSummary, setRelationSummary] = useState([]);
  const [relationCurrentState, setRelationCurrentState] = useState();
  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState([]);
  const [coOccurrenceCurrentState, setCoOccurrenceCurrentState] = useState();

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
        // saving the file as array of lines
        let textArray = data.text.split("\n");
        setTagCurrentState(new Array(textArray.length).fill([]));
        setRelationCurrentState(new Array(textArray.length).fill([]));
        setCoOccurrenceCurrentState(new Array(textArray.length).fill([]));
        setTagsSummary(new Array(textArray.length).fill([]));

        setFile({
          file_id: data.file_id,
          file: data.file,
          text: textArray,
        });
      });
  }, []);

  const exportToFile = () => {
    const fileData = JSON.stringify({
      tags: tagsSummary,
      relations: relationSummary,
      coOccurr: coOccurrenceSummary,
    });
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "allTagging.json";
    link.href = url;
    link.click();
  };

  const saveAnnotation = () => {
    console.log("tagsSummary ", tagsSummary);
    console.log("relationSummary ", relationSummary);
    console.log("coOccurrenceSummary ", coOccurrenceSummary);
    fetch("/api/project/save-annotation", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        project_id: id,
        file_id: file.file_id,
        tags: tagsSummary,
        relations: relationSummary,
        co_occcurrence: coOccurrenceSummary,
      }),
    }).then((response) => {
      console.log(response);
      if (response.status == 201) {
        alert("Annotation information saved");
      }
      return response.json();
    });
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
          {file.text != "" && tagsLabels.length > 0 && isAnnotateTags && (
            <AnnotationTag
              file={file.text}
              labels={tagsLabels}
              tagsSummary={tagsSummary}
              tagCurrentState={tagCurrentState}
              onChangeTags={(newValueSummary, newValueCurrentState) => {
                setTagsSummary(newValueSummary);
                setTagCurrentState(newValueCurrentState);
              }}
            />
          )}
          {file.text != "" &&
            relationsLabels.length > 0 &&
            isAnnotateRelations && (
              <AnnotationRelation
                file={file.text}
                labels={relationsLabels}
                relationSummary={relationSummary}
                relationCurrentState={relationCurrentState}
                onChangeRelation={(newValueSummary, newValueCurrentState) => {
                  setRelationSummary(newValueSummary);
                  setRelationCurrentState(newValueCurrentState);
                }}
              />
            )}
          {file.text != "" && isAnnotateCoOccurrence && (
            <AnnotationCoOccurrence
              file={file.text}
              coOccurrenceCurrentState={coOccurrenceCurrentState}
              coOccurrenceSummary={coOccurrenceSummary}
              onChangeCoOcurr={(newValueSummary, newValueCurrentState) => {
                setCoOccurrenceSummary(newValueSummary);
                setCoOccurrenceCurrentState(newValueCurrentState);
              }}
            />
          )}
        </div>
        <div>
          <button
            class="btn btn-primary"
            id="saveAllTaggingBtn"
            onClick={saveAnnotation}
          >
            Save All Tagging In System
          </button>
          <button
            id="exportAllTaggingBtn"
            class="btn btn-primary"
            onClick={exportToFile}
            style={{ marginLeft: "10px" }}
          >
            Export All Tagging to File
          </button>
        </div>
      </div>
    </div>
  );
}
