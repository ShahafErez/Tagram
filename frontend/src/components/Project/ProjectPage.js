import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import MetaTaggingObject from "./MetaTaggingObject";
import AnnotationTag from "./AnnotationTypes/AnnotationTag";
import AnnotationRelation from "./AnnotationTypes/AnnotationRelation";
import AnnotationCoOccurrence from "./AnnotationTypes/AnnotationCoOccurrence";

export default function ProjectPage() {
  // TODO- check if the user has permissions for this project
  let username = ReactSession.get("username");
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

  // setting the meta tagging values
  const [metaTaggingLabels, setMetaTaggingLabels] = useState([]);
  const [tagsLabels, setTagsLabels] = useState([]);
  const [relationsLabels, setRelationsLabels] = useState([]);

  // setting the annotations values
  const [tagCurrentState, setTagCurrentState] = useState();
  const [relationSummary, setRelationSummary] = useState([]);
  const [relationCurrentState, setRelationCurrentState] = useState();
  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState([]);
  const [coOccurrenceCurrentState, setCoOccurrenceCurrentState] = useState();

  // optional states
  const [isAnnotateTags, setIsAnnotateTags] = useState(false);
  const [isAnnotateRelations, setIsAnnotateRelations] = useState(false);
  const [isAnnotateCoOccurrence, setIsAnnotateCoOccurrence] = useState(false);

  function getMetaTaggingDetails() {
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
          if (label["type"] == "Tag") {
            tags.push(label);
          }
          if (label["type"] == "Relation") {
            relations.push(label);
          }
        });
        setTagsLabels(tags);
        setRelationsLabels(relations);
      })
      .then(() => getFileDetails());
  }

  function getFileDetails() {
    fetch("/api/project/get-file?project_id=" + id)
      .then((response) => {
        if (!response.ok) {
          console.log("response not OK");
        }
        return response.json();
      })
      .then((data) => {
        let textArray = data.text.split("\n");
        setFile({
          file_id: data.file_id,
          file: data.file,
          text: textArray,
        });
        return textArray.length;
      })
      .then((arrayLength) => getAnnotationsDetails(arrayLength));
  }

  function getAnnotationsDetails(arrayLength) {
    fetch(
      "/api/project/get-annotation-of-tagger?project_id=" +
        id +
        "&tagger=" +
        username
    ).then((response) => {
      if (response.status == 204) {
        // annotations not found, setting empty arrays
        setTagCurrentState(new Array(arrayLength).fill([]));
        setRelationCurrentState(new Array(arrayLength).fill([]));
        setCoOccurrenceCurrentState(new Array(arrayLength).fill([]));
      } else if (response.status == 200) {
        // annotations found
        return response.json().then((data) => {
          console.log(data);
          setTagCurrentState(data.tags);

          setRelationSummary(data.relations);
          setCoOccurrenceSummary(data.co_occcurrence);
          setRelationCurrentState(new Array(arrayLength).fill([]));
          setCoOccurrenceCurrentState(new Array(arrayLength).fill([]));
        });
      }
    });
  }

  // getting all project details by a chain of .then() function calls
  useEffect(() => {
    getMetaTaggingDetails();
  }, []);

  const exportToFile = () => {
    const fileData = JSON.stringify({
      tags: tagCurrentState,
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

  const saveAnnotations = () => {
    fetch("/api/project/save-annotation", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        project_id: id,
        file_id: file.file_id,
        tagger: username,
        tags: tagCurrentState,
        relations: relationSummary,
        co_occcurrence: coOccurrenceSummary,
      }),
    }).then((response) => {
      if (response.status == 201) {
        alert("Annotation information saved");
      }
      return response.json();
    });
  };

  return (
    <div>
      {file.text != "" && (
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
                  file={file.text}
                  labels={tagsLabels}
                  tagCurrentState={tagCurrentState}
                  onChangeTags={(newValueCurrentState) => {
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
                    onChangeRelation={(
                      newValueSummary,
                      newValueCurrentState
                    ) => {
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
            {/* save of export the selected annotations */}
            <div>
              <button
                class="btn btn-primary"
                id="saveAllTaggingBtn"
                onClick={saveAnnotations}
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
      )}
    </div>
  );
}
