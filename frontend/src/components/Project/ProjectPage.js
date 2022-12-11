import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectPage() {
  let { id } = useParams();
  const [project, setProject] = useState({
    title: "",
    description: "",
    is_project_manager: false,
    created_at: "",
  });

  useEffect(() => {
    fetch("/api/project/get?project_id=" + id)
      .then((response) => {
        if (!response.ok) {
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setProject(data);
      });
    // we need to put [] as the second argument, if we want to render only once
  }, []);

  return (
    <div>
      <h2>Welcome to project page {project.title}</h2>
      <h3> Project Id: {id}</h3>
      <h3> Description: {project.description}</h3>
      <h3> Is the manager: {String(project.is_project_manager)}</h3>
      <h3> Creation date: {project.created_at}</h3>
    </div>
  );
}
