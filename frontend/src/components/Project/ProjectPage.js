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

  // settings arrays for labels & labels types
  const [metaTaggingLabels, setMetaTaggingLabels] = useState([]);
  const [tagsLabels, setTagsLabels] = useState([]);
  const [relationsLabels, setRelationsLabels] = useState([]);

  const [isAnnotateTags, setIsAnnotateTags] = useState(true);
  const [isAnnotateRelations, setIsAnnotateRelations] = useState(false);
  const [isAnnotateCoOccurrence, setIsAnnotateCoOccurrence] = useState(false);

  const [fileArrayLength, setFileArrayLength] = useState();
  // setting the summary and current state for each annotation type
  const [tagsSummary, setTagsSummary] = useState();
  const [tagCurrentState, setTagCurrentState] = useState();
  const [relationSummary, setRelationSummary] = useState([]);
  const [relationCurrentState, setRelationCurrentState] = useState();
  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState([]);
  const [coOccurrenceCurrentState, setCoOccurrenceCurrentState] = useState();
  console.log("summmary ", coOccurrenceSummary);

  let textArrayLength;
  // getting project details
  useEffect(() => {
    console.log("FUNCTION SHOULD BE NUMBER 1");
    async function getProjcetDetails() {
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
    }
    async function getProjcetFile() {
      fetch("/api/project/get-file?project_id=" + id)
        .then((response) => {
          if (!response.ok) {
            console.log("response not OK");
          }
          return response.json();
        })
        .then((data) => {
          // setting file details
          let textArray = data.text.split("\n");
          console.log("!!!!!!!!!!!!!!!!!!! ", textArray.length);

          textArrayLength = textArray.length;
          setFileArrayLength(textArray.length);
          setFile({
            file_id: data.file_id,
            file: data.file,
            text: textArray,
          });
        });
    }

    async function getAnnotations() {
      fetch("/api/project/get-annotation?project_id=" + id).then((response) => {
        console.log("11 ", fileArrayLength);
        console.log("22 ", textArrayLength);
        let arrayLength = textArrayLength;
        // checking if the projcet has saved annotation
        if (response.status == 204) {
          // annotations not found, setting empty arrays
          console.log("not found");
          console.log("arrayLength ", arrayLength);
          setTagCurrentState(new Array(arrayLength).fill([]));
          setTagsSummary(new Array(arrayLength).fill([]));
          setRelationCurrentState(new Array(arrayLength).fill([]));
          setCoOccurrenceCurrentState(new Array(arrayLength).fill([]));
          let a = new Array(arrayLength).fill([]);
          console.log("a!!!!!!!!1 ", a.length > 0);
          console.log("222 ", coOccurrenceSummary);
        } else if (response.status == 200) {
          // annotations found
          return response.json().then((data) => {
            console.log("annotatio tags: ", data.tags);
            console.log("annotatio relations: ", data.relations);
            console.log("annotatio co_occcurrence: ", data.co_occcurrence);
            setTagCurrentState(data.tags);
            setTagsSummary(data.tags);
            setRelationSummary(data.relations);
            setCoOccurrenceSummary(data.co_occcurrence);
          });
        }
      });
    }

    console.log("SHOULD CALL 1");
    getProjcetDetails();
    console.log("SHOULD CALL 2");
    getProjcetFile();
    console.log("SHOULD CALL 3");
    getAnnotations();
    // .then(() => getProjcetFile())
    // .then(() => getAnnotations());
    // .then(() => getAnnotations());
    // [] is the second argument, to render this function only once
  }, []);

  // useEffect(() => {
  //   fetch("/api/project/get-file?project_id=" + id)
  //     .then((response) => {
  //       if (!response.ok) {
  //         console.log("response not OK");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       // setting file details
  //       let textArray = data.text.split("\n");
  //       textArrayLength = textArray.length;
  //       setFileArrayLength(textArray.length);
  //       console.log("textArray ", textArray.length);
  //       console.log("FileArrayLength ", fileArrayLength);
  //       setFile({
  //         file_id: data.file_id,
  //         file: data.file,
  //         text: textArray,
  //       });
  //     });
  // }, []);

  useEffect(() => {
    console.log("FUNCTION SHOULD BE NUMBER 2");
    async function getProjcetFile() {
      fetch("/api/project/get-file?project_id=" + id)
        .then((response) => {
          if (!response.ok) {
            console.log("response not OK");
          }
          return response.json();
        })
        .then((data) => {
          // setting file details
          let textArray = data.text.split("\n");
          console.log("!!!!!!!!!!!!!!!!!!! ", textArray.length);

          textArrayLength = textArray.length;
          setFileArrayLength(textArray.length);
          setFile({
            file_id: data.file_id,
            file: data.file,
            text: textArray,
          });
        });
    }
    // getProjcetFile();
  }, []);

  useEffect(() => {
    console.log("FUNCTION SHOULD BE NUMBER 3");
    async function getAnnotations() {
      fetch("/api/project/get-annotation?project_id=" + id).then((response) => {
        console.log("11 ", fileArrayLength);
        console.log("22 ", textArrayLength);
        let arrayLength = textArrayLength;
        // checking if the projcet has saved annotation
        if (response.status == 204) {
          // annotations not found, setting empty arrays
          console.log("not found");
          console.log("arrayLength ", arrayLength);
          setTagCurrentState(new Array(arrayLength).fill([]));
          setTagsSummary(new Array(arrayLength).fill([]));
          setRelationCurrentState(new Array(arrayLength).fill([]));
          setCoOccurrenceCurrentState(new Array(arrayLength).fill([]));
          let a = new Array(arrayLength).fill([]);
          console.log("a!!!!!!!!1 ", a.length > 0);
          console.log("222 ", coOccurrenceSummary);
        } else if (response.status == 200) {
          // annotations found
          return response.json().then((data) => {
            console.log("annotatio tags: ", data.tags);
            console.log("annotatio relations: ", data.relations);
            console.log("annotatio co_occcurrence: ", data.co_occcurrence);
            setTagCurrentState(data.tags);
            setTagsSummary(data.tags);
            setRelationSummary(data.relations);
            setCoOccurrenceSummary(data.co_occcurrence);
          });
        }
      });
    }
    // getAnnotations();
  }, []);

  // // getting project file from database
  // async function getProjcetFile() {
  //   fetch("/api/project/get-file?project_id=" + id)
  //     .then((response) => {
  //       if (!response.ok) {
  //         console.log("response not OK");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       // setting file details
  //       let textArray = data.text.split("\n");
  //       setFile({
  //         file_id: data.file_id,
  //         file: data.file,
  //         text: textArray,
  //       });
  //     });
  // }

  // // getting annotation details from database
  // async function getAnnotations() {
  //   fetch("/api/project/get-annotation?project_id=" + id).then((response) => {
  //     let arrayLength = textArray.length;
  //     // checking if the projcet has saved annotation
  //     if (response.status == 204) {
  //       // annotations not found, setting empty arrays
  //       console.log("not found");
  //       console.log("arrayLength ", arrayLength);
  //       setTagCurrentState(new Array(arrayLength).fill([]));
  //       setTagsSummary(new Array(arrayLength).fill([]));
  //       setRelationCurrentState(new Array(arrayLength).fill([]));
  //       setCoOccurrenceCurrentState(new Array(arrayLength).fill([]));
  //       let a = new Array(arrayLength).fill([]);
  //       console.log("a!!!!!!!!1 ", a.length > 0);
  //       console.log("222 ", coOccurrenceSummary);
  //     } else if (response.status == 200) {
  //       // annotations found
  //       return response.json().then((data) => {
  //         console.log("annotatio tags: ", data.tags);
  //         console.log("annotatio relations: ", data.relations);
  //         console.log("annotatio co_occcurrence: ", data.co_occcurrence);
  //         setTagCurrentState(data.tags);
  //         setTagsSummary(data.tags);
  //         setRelationSummary(data.relations);
  //         setCoOccurrenceSummary(data.co_occcurrence);
  //       });
  //     }
  //   });
  // }

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
      if (response.status == 201) {
        alert("Annotation information saved");
      }
      return response.json();
    });
  };

  console.log("44 ", coOccurrenceSummary.length);

  return (
    <div>
      {file.text != "" && coOccurrenceSummary.length > 0 && (
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
      )}
    </div>
  );
}
