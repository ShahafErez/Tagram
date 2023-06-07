import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import MetaTaggingObject from "./MetaTaggingObject";
import AnnotationTag from "./AnnotationTypes/AnnotationTag";
import AnnotationRelation from "./AnnotationTypes/AnnotationRelation";
import AnnotationCoOccurrence from "./AnnotationTypes/AnnotationCoOccurrence";
import ErrorPage from "../ErrorPage";

export default function ProjectPage() {
  let username = new URLSearchParams(window.location.search).get("username");
  let logged_in_user = ReactSession.get("username");
  let is_manager = ReactSession.get("is_admin");
  let { id } = useParams();

  // setting project and file
  const [project, setProject] = useState();
  const [file, setFile] = useState({
    file_id: "",
    file: "",
    text: "",
  });

  // is user assigned to project
  const [isUserAssigned, setIsUserAssigned] = useState(false);

  // setting the meta tagging values
  const [metaTaggingLabels, setMetaTaggingLabels] = useState([]);
  const [tagsLabels, setTagsLabels] = useState([]);
  const [relationsLabels, setRelationsLabels] = useState([]);

  // setting the annotations values
  const [tagSummary, setTagSummary] = useState([]);
  const [tagCurrentState, setTagCurrentState] = useState();
  const [relationSummary, setRelationSummary] = useState([]);
  const [relationCurrentState, setRelationCurrentState] = useState();
  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState([]);
  const [coOccurrenceCurrentState, setCoOccurrenceCurrentState] = useState();

  // annotation type selected
  const [isAnnotateTags, setIsAnnotateTags] = useState(false);
  const [isAnnotateRelations, setIsAnnotateRelations] = useState(false);
  const [isAnnotateCoOccurrence, setIsAnnotateCoOccurrence] = useState(false);

  // annotation status
  const [annotationStatus, setAnnotationStatus] = useState();

  function getPojectDetails() {
    fetch("/api/users/is-assigned?username=" + username + "&project_id=" + id)
      .then((response) => {
        // project not found
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((data) => {
        if (data != null) {
          setIsUserAssigned(data.Assigned);
          return true; // data is valid
        } else {
          // data is unvalid
          return false;
        }
      })
      .then((isValid) => {
        if (isValid) {
          getMetaTaggingDetails();
        }
      });
  }

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
        setRelationCurrentState(new Array(arrayLength).fill([]));
        setCoOccurrenceCurrentState(new Array(arrayLength).fill([]));
        setAnnotationStatus("not_submitted");
        setTagCurrentState(new Array(arrayLength).fill([]));
      } else if (response.status == 200) {
        // annotations found
        return response.json().then((data) => {
          setTagSummary(data.tags);
          setRelationSummary(data.relations);
          setCoOccurrenceSummary(data.co_occcurrence);
          setRelationCurrentState(new Array(arrayLength).fill([]));
          setCoOccurrenceCurrentState(new Array(arrayLength).fill([]));
          setAnnotationStatus(data.annotation_status);
          setTagCurrentState(new Array(arrayLength).fill([]));
          // checking if the user has the current state saved in it's local storage
        });
      }
    });
  }

  // getting all project details by a chain of .then() function calls
  useEffect(() => {
    getPojectDetails();
    // getMetaTaggingDetails();
  }, []);

  // exporting the annotations to a json file
  function exportToFile() {
    const fileData = JSON.stringify({
      tags: tagSummary,
      relations: relationSummary,
      coOccurr: coOccurrenceSummary,
    });
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "allTagging.json";
    link.href = url;
    link.click();
  }

  // saving annotations in database
  function saveAnnotations(toSubmit) {
    fetch("/api/project/save-annotation", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        project_id: id,
        tagger: username,
        tags: tagSummary,
        relations: relationSummary,
        co_occcurrence: coOccurrenceSummary,
      }),
    })
      .then((response) => {
        if (response.status == 201) {
          alert("Annotation information saved");
        }
        return response.json();
      })
      .then(() => {
        if (toSubmit) {
          changeAnnotationsStatus("submitted", true);
        } else {
          changeAnnotationsStatus(annotationStatus, false);
        }
      });
  }

  // changing the status of the annotations {not_submitted, submitted, changes_requested}
  function changeAnnotationsStatus(status, showAlert) {
    fetch(
      "/api/project/edit-annotation-status?project_id=" +
        id +
        "&tagger=" +
        username,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json ; charset=utf-8" },
        body: JSON.stringify({
          annotation_status: status,
        }),
      }
    ).then((response) => {
      if (response.status == 202) {
        if (showAlert) {
          alert(`Annotations status changed to ${status.replace("_", " ")}`);
        }
        setAnnotationStatus(status);
      }
      return response.json();
    });
  }

  // rendering projcet page
  function renderProjectPage() {
    return (
      <div>
        {file.text != "" && (
          <div
            class="card project-page"
            style={{
              textAlign: "center",
              width: "80%",
              margin: "auto",
              minHeight: "500px",
            }}
          >
            {/* showing project information- title, description, meta tagging */}
            <div class="card-body">
              <h2 class="card-title">{project.title}</h2>

              {project.description != "" && (
                <p class="card-text">{project.description}</p>
              )}

              {metaTaggingLabels.length > 0 && (
                <MetaTaggingObject metaTagging={metaTaggingLabels} />
              )}

              {/* selecting what label type to annotate */}
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

                {/* rendering the annotation components */}
                {tagsLabels.length > 0 && isAnnotateTags && (
                  <AnnotationTag
                    file={file.text}
                    labels={tagsLabels}
                    tagSummary={tagSummary}
                    tagCurrentState={tagCurrentState}
                    onChangeTags={(newValueSummary, newValueCurrentState) => {
                      setTagSummary(newValueSummary);
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
                    onChangeCoOcurr={(
                      newValueSummary,
                      newValueCurrentState
                    ) => {
                      setCoOccurrenceSummary(newValueSummary);
                      setCoOccurrenceCurrentState(newValueCurrentState);
                    }}
                  />
                )}
              </div>

              {/* saving and changing status for annotation */}
              <div
                style={{
                  width: "60%",
                  marginTop: "25px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <p
                  style={{
                    color: "#fd8c00",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Please save all annotation type separately before saving all
                </p>
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Basic example"
                  style={{
                    paddingLeft: "13px",
                    paddingRight: "13px",
                    width: "-webkit-fill-available",
                  }}
                >
                  <button
                    class="btn btn-primary"
                    id="saveAllTaggingBtn"
                    style={{ marginTop: "0px", width: "33%" }}
                    title="save taggings without changing the status"
                    onClick={() => saveAnnotations(false)}
                  >
                    Save
                  </button>
                  <button
                    id="exportAllTaggingBtn"
                    class="btn btn-success"
                    style={{
                      marginTop: "0px",
                      marginLeft: "2px",
                      width: "33%",
                    }}
                    title="save taggings and change status to submitted"
                    onClick={() => saveAnnotations(true)}
                  >
                    Save & Submit
                  </button>
                  {is_manager == true && (
                    <button
                      class="btn btn-warning"
                      style={{
                        marginTop: "0px",
                        marginLeft: "2px",
                        width: "33%",
                        backgroundColor: "#ffac33",
                        color: "white",
                      }}
                      title="request changes from the annotator"
                      onClick={() =>
                        changeAnnotationsStatus("changes_requested")
                      }
                    >
                      Request Changes
                    </button>
                  )}
                </div>

                {/* current status of the annotation */}
                <div style={{ marginTop: "7px", fontSize: "16px" }}>
                  {annotationStatus == "not_submitted" && (
                    <div>You haven't submitted the tagging yet</div>
                  )}
                  {annotationStatus == "submitted" && (
                    <div>You have submitted tagging</div>
                  )}
                  {annotationStatus == "changes_requested" && (
                    <div style={{ color: "#e56000" }}>
                      <i
                        class="bi bi-exclamation-triangle"
                        style={{
                          marginRight: "5px",
                        }}
                      ></i>
                      Changes were requested on your tagging
                    </div>
                  )}
                </div>
                <i
                  class="bi bi-download"
                  onClick={exportToFile}
                  style={{
                    marginRight: "15px",
                    fontSize: "20px",
                    verticalAlign: "bottom",
                    cursor: "pointer",
                  }}
                  title="download taggings"
                ></i>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /** If the user has permissions- showing the project page
   * If not- showing error page
   */
  function renderPage() {
    // if the user is not manager- they can only see their taggings
    // if the username is not assigned to the project, the page will be blocked
    if (
      project.project_manager != logged_in_user &&
      (username != logged_in_user || isUserAssigned == false)
    ) {
      return <ErrorPage />;
    } else {
      return renderProjectPage();
    }
  }

  return project != undefined && <div>{renderPage()}</div>;
}
