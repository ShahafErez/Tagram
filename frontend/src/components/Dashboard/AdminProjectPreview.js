import React from "react";

export default function ProjectPreviewAdmin(props) {
  let project = props.project;

  return (
    <div>
      {project ? (
        <div class="card project-preview">
          <h4 class="card-title" style={{ marginBottom: "0px" }}>
            {project.title}
          </h4>
          <hr style={{ marginTop: "10px" }} />
          {project.description ? (
            <div>
              <h5>{project.description}</h5>
            </div>
          ) : (
            <h5>No description</h5>
          )}
          {project.created_at ? (
            <span>{project.created_at.slice(0, 10)}</span>
          ) : null}
          <button style={{ marginTop: "5px", borderRadius: "5px" }}>
            Show Project Details
          </button>
        </div>
      ) : null}
    </div>
  );
}
