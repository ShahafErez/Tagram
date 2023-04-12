import React, { useEffect, useState } from "react";
import ProjectStatistics from "./ProjectStatistics";
import { Button } from "react-bootstrap";

export default function AdminDashboardProjectTable({ data }) {
  const [currentProject, setCurrentProject] = useState("");

  const showProjectStatistics = (id) => {
    setCurrentProject(id);
  };

  return (
    <div>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">project_id</th>
              <th scope="col">title</th>
              <th scope="col">description</th>
              <th scope="col">meta_tagging</th>
              <th scope="col">project_manager</th>
              <th scope="col">created_at</th>
              <th scope="col">get statistics</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.project_id}>
                <td>{item.project_id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.meta_tagging}</td>
                <td>{item.project_manager}</td>
                <td>{item.created_at}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => showProjectStatistics(item.project_id)}
                  >
                    Show
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        {currentProject && <ProjectStatistics project_id={currentProject} />}
      </div>
    </div>
  );
}
