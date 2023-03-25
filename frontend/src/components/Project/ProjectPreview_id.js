import React, { useEffect, useState } from "react";

export default function PreojctPreview_id(props) {
  let project = props.project;
  console.log(project)


  return (
    <div class="card project-preview">
      <h4 class="card-title" style={{ color: "#476fb8" }}>
        {project.project}
      </h4>
    </div>
  );
}
