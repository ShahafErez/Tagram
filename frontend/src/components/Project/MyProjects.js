import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectPreview from "./ProjectPreview";
export default function MyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  // getting projects
  useEffect(() => {
    fetch("/api/project/get-all")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);
  return (
    <div
      class="row row-cols-1 row-cols-md-3"
      style={{ textAlign: "center", margin: "auto" }}
    >
      {projects.length > 0 &&
        projects.map((project, index) => (
          <div
            class="col mb-2"
            onClick={() => {
              navigate("/project/" + project.project_id);
            }}
            style={{ cursor: "pointer" }}
          >
            <ProjectPreview
              id={project.project_id}
              title={project.title}
              metaTagging={project.meta_tagging}
            />
          </div>
        ))}
    </div>
  );
}
