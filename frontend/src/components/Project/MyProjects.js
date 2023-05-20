import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectPreview from "./ProjectPreview";
import { ReactSession } from "react-client-session";

export default function MyProjects() {
  let username = ReactSession.get("username");
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  // getting projects
  useEffect(() => {
    fetch(`/api/users/projects-by-username/?user=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
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
      <h2 style={{ margintTop: "5px", marginBottom: "20px" }}>
        Projects You Annotate
      </h2>
      <div
        class="row row-cols-1 row-cols-md-3"
        style={{
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
                navigate("/project/" + project_id + "?username=" + username);
              }}
              style={{ cursor: "pointer" }}
            >
              <ProjectPreview project={project} />
            </div>
          ))}
      </div>
    </div>
  );
}
