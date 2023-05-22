import React, { useEffect, useState } from "react";
import ProjectStatistics from "./ProjectStatistics";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AdminProjectPage() {
  let { projectId } = useParams();
  const navigate = useNavigate();
  const [projectInfo, setProjectInfo] = useState();
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    fetch(`/api/project/get-annotators-status?project_id=${projectId}`)
      .then((response) => {
        if (response.status != 200) {
          return;
        }
        return response.json();
      })
      .then((data) => {
        setProjectInfo(data);
      });
  }, []);

  return (
    <div
      class="card project-page"
      style={{
        paddingTop: "10px",
        textAlign: "center",
        width: "80%",
        margin: "auto",
        minHeight: "500px",
      }}
    >
      {projectInfo != undefined && (
        <div class="card-body">
          <h2 class="card-title">Project Details {projectInfo.title}</h2>
          <hr />
          {/* Show all the taggers and their status */}
          <h3 class="card-subtitle mb-2 text-muted">Annotators Information</h3>
          <div
            class="row row-cols-1 row-cols-md-3 g-4"
            style={{ padding: "10px" }}
          >
            {projectInfo.annotators.map((annotator, index) => (
              <div
                class="col"
                style={{
                  paddingLeft: "7px",
                  paddingRight: "7px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(
                    "/project/" +
                      projectInfo.project_id +
                      "?username=" +
                      annotator.tagger
                  );
                }}
              >
                <div class="card">
                  <div class="card-body" style={{ padding: "10px" }}>
                    <h5 class="card-title" style={{ margin: "auto" }}>
                      <span style={{ fontWeight: "500" }}>username: </span>
                      {annotator.tagger}
                    </h5>
                    <p class="card-text" style={{ marginTop: "5px" }}>
                      <span style={{ fontWeight: "500" }}>status:</span>{" "}
                      {annotator.annotation_status.replace("_", " ")}
                      {annotator.annotation_status == "submitted" && (
                        <i
                          class="bi bi-person-circle"
                          style={{ marginLeft: "5px", color: "#639e2f" }}
                        ></i>
                      )}
                      {annotator.annotation_status == "changes_requested" && (
                        <i
                          class="bi bi-person-circle"
                          style={{ marginLeft: "5px", color: "#ffac33" }}
                        ></i>
                      )}
                      {annotator.annotation_status == "not_submitted" && (
                        <i
                          class="bi bi-person-circle"
                          style={{ marginLeft: "5px" }}
                        ></i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "5px" }}>
            <button
              type="button"
              class="btn btn-outline-primary"
              onClick={() => setShowStatistics(true)}
            >
              Show Statistics
            </button>
            {showStatistics && <ProjectStatistics project_id={projectId} />}

            <button
              type="button"
              class="btn btn-outline-primary"
              onClick={() => navigate("/automation/" + projectInfo.project_id)}
              style={{ marginLeft: "15px" }}
            >
              Automatic Annotation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
