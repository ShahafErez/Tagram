import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectPreview from "./ProjectPreview";
export default function MyProjects2() {
  console.log("my projects  ");
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
      style={{
        textAlign: "center",
        margin: "auto",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
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
            <ProjectPreview project={project} />
          </div>
        ))}
    </div>
  );
}
