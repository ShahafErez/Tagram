import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectPreviewAdmin(props) {
  let project = props.project;
  const navigate = useNavigate();

  return (
    <div>
      {project ? (
        <div class="card project-preview">
          <div
            onClick={() => {
              navigate("/manager/" + project.project_id);
            }}
          >
            <h4 class="card-title" style={{ marginBottom: "0px" }}>
              {project.title}
            </h4>
            <hr style={{ marginTop: "10px" }} />
            {project.project_description ? (
              <div>
                <h5>{project.description}</h5>
              </div>
            ) : (
              <h5>No description</h5>
            )}
            {project.created_at ? (
              <span>{project.created_at.slice(0, 10)}</span>
            ) : null}
          </div>
          <button
            variant="primary"
            style={{ marginTop: "5px" }}
            onClick={() => {
              navigate("/manager/" + project.project_id + "/statistics");
            }}
          >
            Show Project Statistics
          </button>
        </div>
      ) : null}
    </div>
  );
}
