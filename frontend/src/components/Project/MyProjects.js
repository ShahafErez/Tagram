import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectPreview from "./ProjectPreview";
import { ReactSession } from "react-client-session";

export default function MyProjects2() {
  let username = ReactSession.get("username");
  console.log("my project page, username: ", username);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  // getting projects
  useEffect(() => {
    fetch(`/api/users/projects-by-username/?user=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        console.log(data);
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
              let project_id = project.project
                .split(" ")[2]
                .replace("(", "")
                .replace(")", "");
              navigate("/project/" + project_id);
            }}
            style={{ cursor: "pointer" }}
          >
            <ProjectPreview project={project} />
          </div>
        ))}
    </div>
  );
}
