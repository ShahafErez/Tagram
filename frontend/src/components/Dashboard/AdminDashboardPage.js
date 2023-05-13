import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectPreviewAdmin from "./AdminProjectPreview";
import { useNavigate } from "react-router-dom";
import "../../../static/css/AdminDashboardProjectTable.css";

export default function AdminDashboardPage() {
  let { username } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  // getting projects
  useEffect(() => {
    fetch(`/api/project/get-by-project-manager?manager=${username}`)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((data) => {
        if (data != null) {
          setProjects(data);
        }
      });
  }, []);

  return (
    <div>
      <h2 style={{ margintTop: "5px", marginBottom: "20px" }}>
        Projects You Manage
      </h2>
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
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/manager/" + project.project_id);
              }}
            >
              <ProjectPreviewAdmin project={project} />
            </div>
          ))}
      </div>
    </div>
  );
}
