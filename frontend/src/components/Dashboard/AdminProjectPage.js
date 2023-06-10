import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import ProjectStatistics from "./ProjectStatistics";

export default function AdminProjectPage() {
  let { projectId } = useParams();
  let logged_in_user = ReactSession.get("username");
  const navigate = useNavigate();
  const [projectInfo, setProjectInfo] = useState();
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    fetch(`/api/project/get-annotators-status?project_id=${projectId}`)
      .then((response) => {
        if (response.status != 200) {
          return <ErrorPage />;
        }
        return response.json();
      })
      .then((data) => {
        setProjectInfo(data);
      });
  }, []);

  function renderAdminProjectPage() {
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
            <h3 class="card-subtitle mb-2 text-muted">
              Annotators Information
            </h3>
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
                onClick={() => navigate("/edit/" + projectInfo.project_id)}
              >
                Edit project{" "}
                <i
                  class="bi bi-pencil-square"
                  style={{ marginLeft: "5px" }}
                ></i>
              </button>

              <button
                type="button"
                class="btn btn-outline-primary"
                style={{ marginLeft: "15px" }}
                onClick={() =>
                  navigate("/automation/" + projectInfo.project_id)
                }
              >
                Automatic Annotation
                <i class="bi bi-calculator" style={{ marginLeft: "5px" }}></i>
              </button>

              <button
                type="button"
                class="btn btn-outline-primary"
                style={{ marginLeft: "15px" }}
                onClick={() => setShowStatistics(true)}
              >
                Show Statistics
                <i class="bi bi-graph-up" style={{ marginLeft: "5px" }}></i>
              </button>

              {showStatistics && <ProjectStatistics project_id={projectId} />}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderPage() {
    if (logged_in_user != projectInfo.project_manager) {
      return <ErrorPage />;
    } else {
      return renderAdminProjectPage();
    }
  }

  return <div>{projectInfo != undefined && <div>{renderPage()}</div>}</div>;
}
