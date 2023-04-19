import React, { useEffect, useState } from "react";

export default function ProjectPreview(props) {
  let project = props.project;

  return (
    <div>
      {project ? (
        <div class="card project-preview">
          <h4 class="card-title">{project.project_title}</h4>
          <hr />
          {project.project_description ? (
            <div>
              <h5>{project.project_description}</h5>
            </div>
          ) : (
            <h5>No description</h5>
          )}
          {project.project_created_at ? (
            <span>{project.project_created_at.slice(0, 10)}</span>
          ) : null}
          <button style={{ marginTop: "5px" }}>Go To Project Page</button>
        </div>
      ) : null}
    </div>
  );
}
