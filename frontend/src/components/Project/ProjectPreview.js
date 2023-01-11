import React, { useEffect, useState } from "react";
export default function ProjectPreview(props) {
  return (
    <div class="card">
      <h5 class="card-title">{props.title}</h5>
      <p>project id: {props.id}</p>
      <p>meta tagging id: {props.metaTagging}</p>
    </div>
  );
}
